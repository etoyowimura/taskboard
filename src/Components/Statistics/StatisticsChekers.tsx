import { Button, Input, Select, Space, Table, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import tagIcon from "../../assets/tagIcon.svg";

import { theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTeamData } from "../../Hooks/Teams";
import { useStatsData } from "../../Hooks/Statistics";
import { statController } from "../../API/LayoutApi/statistic";
import { debounce } from "lodash";

interface StatisticsChekersProps {
  startDate: string;
  endDate: string;
}

const StatisticsChekers: React.FC<StatisticsChekersProps> = ({
  startDate,
  endDate,
}) => {
  const [team, setTeam] = useState<any>("");
  const [search, setSearch] = useState<string>("");
  const { token } = theme.useToken();
  const teamData = useTeamData({});
  const teamOptions: { label: string; value: any }[] | undefined =
    teamData?.data?.map((item: any) => ({
      label: item?.name,
      value: item?.name,
    }));

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem("general_pageSize");
    return saved ? Number(saved) : 15;
  });

  const pageSizeOptions = [15, 20, 30, 40, 50];

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  useEffect(() => {
    localStorage.setItem("general_pageSize", String(pageSize));
  }, [pageSize]);

  const Next = () => {
    const a = Number(page) + 1;
    setPage(a);
  };
  const Previos = () => {
    Number(page);
    if (page > 1) {
      const a = Number(page) - 1;
      setPage(a);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSave = (a: string) => {
    const trimmedStartDate = startDate.slice(0, 10);
    const trimmedEndDate = endDate.slice(0, 10);
    const fileName = `${trimmedStartDate}-${trimmedEndDate}`;
    if (a === "team") {
      const teamName = `${team}_${fileName}`;
      statController.saveUsersStats(teamName, startDate, endDate, team);
    } else {
      statController.saveTeamStats(fileName, startDate, endDate);
    }
  };

  const { data, refetch, isLoading } = useStatsData({
    search: search,
    team: team,
    start_date: startDate,
    end_date: endDate,
    page: page,
    page_size: pageSize,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ marginRight: 12 }}>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={handleSearchChange}
          />
        </div>
        <Select
          style={{ width: 260 }}
          placeholder="Team"
          onChange={(value: any) => setTeam(value)}
          options={teamOptions}
          allowClear
        />
      </div>

      <Table
        size="small"
        loading={isLoading}
        dataSource={data?.data?.map((u: any, i: any) => ({
          no: i + 1,
          ...u,
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            key: "no",
            width: "5%",
          },
          {
            title: "Support specialist",
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Team",
            dataIndex: "team_name",
            key: "team_name ",
          },
          {
            title: "Tasks",
            dataIndex: "number_of_tasks",
            key: "number_of_tasks",
            sorter: (a: any, b: any) => a.number_of_tasks - b.number_of_tasks,
            sortDirections: ["ascend", "descend"],
          },
          {
            title: "Points",
            dataIndex: "total_points",
            key: "total_points",
            sorter: (a: any, b: any) => a.total_points - b.total_points,
            sortDirections: ["ascend", "descend"],
          },
        ]}
        pagination={false}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        bordered
      />
      <Button
        type="primary"
        onClick={(e) => handleSave("team")}
        style={{ marginTop: 10, marginBottom: 40 }}
      >
        Save as file
      </Button>

      <Space style={{ width: "100%", marginTop: 40 }} direction="vertical">
        <Space
          style={{
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: token.colorBgContainer,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            padding: "10px 0",
            zIndex: 1000,
          }}
          wrap
        >
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 65, marginRight: 16 }}
            options={pageSizeOptions.map((size) => ({
              label: `${size}`,
              value: size,
            }))}
          />

          <Button
            onClick={Previos}
            disabled={data?.data?.previous ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <LeftOutlined />
          </Button>
          <Input
            disabled
            style={{
              width: 40,
              textAlign: "center",
              background: token.colorBgContainer,
              border: "1px solid",
              borderColor: token.colorText,
              color: token.colorText,
            }}
            value={page}
            onChange={(e) => {
              let num = e.target.value;
              if (Number(num) && num !== "0") {
                setPage(Number(num));
              }
            }}
          />
          <Button
            onClick={Next}
            disabled={data?.data?.next ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <RightOutlined />
          </Button>
        </Space>
      </Space>
    </>
  );
};

export default StatisticsChekers;
