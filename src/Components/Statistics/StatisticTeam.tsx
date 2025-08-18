import { Button, Input, Select, Space, Table, Tag } from "antd";
import { TStatTeam, TteamChartData } from "../../types/Statistic/TStat";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import { theme } from "antd";
import tagIcon from "../../assets/tagIcon.svg";
import { useStatTeamData, useTeamChartData } from "../../Hooks/Statistics";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface StatisticTeamProps {
  startDate: string;
  endDate: string;
}

const StatisticTeam: React.FC<StatisticTeamProps> = ({
  startDate,
  endDate,
}) => {
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

  const { data, isLoading, refetch } = useStatTeamData({
    page: page,
    page_size: pageSize,
    start_date: startDate,
    end_date: endDate,
  });

  const today = dayjs().endOf("day");

  let finalEndDate = dayjs(endDate);

  if (finalEndDate.isAfter(today)) {
    finalEndDate = today;
  }
  const formattedEndDate = finalEndDate.format("YYYY-MM-DD HH:mm:ss");

  interface TeamschartDataType {
    data?: TteamChartData[];
    refetch: <TPageData>(
      options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<TteamChartData[], unknown>>;
    isLoading: boolean;
  }

  const TeamschartData: TeamschartDataType = useTeamChartData({
    start_date: startDate,
    end_date: formattedEndDate,
  });

  const predefinedColors = [
    "#ff2600",
    "#FF4500",
    "#FF1493",
    "#006800",
    "#3CB371",
    "#00BFFF",
    "#FFD700",
    "#F08080",
    "#8A2BE2",
    "#FFB6C1",
  ];

  function updateLines(chartData: any, predefinedColors: any) {
    if (!chartData || chartData.length === 0) {
      return [];
    }

    const keys = Object.keys(chartData[0]).filter((key) => key !== "date");

    const newLines = keys.flatMap((key, index) => {
      const color = predefinedColors[index % predefinedColors.length];

      return [
        {
          key: `${key}.total_points`,
          color,
          name: `${key} points`,
          legend_name: `${key}`,
        },
      ];
    });

    return newLines;
  }

  const lines = TeamschartData.data
    ? updateLines(TeamschartData.data, predefinedColors)
    : [];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-EN", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const { token } = theme.useToken();
  return (
    <>
      <div>
        <Table
          loading={isLoading}
          size="small"
          dataSource={data?.data?.map((u: any, i: any) => ({
            no: i + 1,
            ...u,
          }))}
          columns={[
            {
              title: <img src={tagIcon} alt="" />,
              dataIndex: "no",
            },
            {
              title: "Team",
              dataIndex: "name",
            },
            {
              title: "Total tasks",
              dataIndex: "number_of_tasks",
            },
            {
              title: "Total points",
              dataIndex: "total_points",
            },
            {
              title: "Is Active",
              dataIndex: "is_active",
              render: (tag: boolean) => (
                <Tag color={tag ? "geekblue" : "red"}>
                  {tag ? "True" : "False"}
                </Tag>
              ),
              filters: [
                {
                  text: "True",
                  value: true,
                },
                {
                  text: "False",
                  value: false,
                },
              ],
              onFilter: (
                value: string | number | boolean,
                record: TStatTeam
              ) => {
                return record.is_active === value;
              },
            },
          ]}
          pagination={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "odd-row" : "even-row"
          }
          bordered
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 30 }}>
        <ResponsiveContainer width="100%" height={517}>
          <LineChart
            data={TeamschartData.data || []}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid vertical={false} stroke="#D7D8E080" />
            <XAxis
              dataKey="date"
              style={{
                color: "#9B9DAA",
                fontSize: 12,
                lineHeight: "15.4px",
                fontWeight: 400,

                letterSpacing: 0.8,
              }}
              tickFormatter={formatDate}
            />
            <YAxis
              style={{
                color: "#9B9DAA",
                fontSize: 10,
                fontWeight: 400,
              }}
            />
            <Tooltip />
            <Legend
              payload={lines.map((line) => ({
                value: line.legend_name,
                type: "line",
                id: line.key,
                color: line.color,
              }))}
            />

            {lines.map((line, index) => (
              <Line
                key={index}
                type="linear"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
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

export default StatisticTeam;
