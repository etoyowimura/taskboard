import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Select, Space, Table, Tag, Tooltip } from "antd";
import { theme } from "antd";
import tagIcon from "../../assets/tagIcon.svg";
import { useCreatorsData } from "../../Hooks/Statistics";

import { debounce } from "lodash";

import { SearchOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";

interface StatisticsTechSupportProps {
  startDate: string;
  endDate: string;
}

const StatisticsTechSupport: React.FC<StatisticsTechSupportProps> = ({
  startDate,
  endDate,
}) => {
  const { token } = theme.useToken();

  const [SupportSearch, setSupportSearch] = useState<string>("");

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

  const handleTechSupportSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSupportSearch(value);
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const { data, isLoading } = useCreatorsData({
    page: page,
    page_size: pageSize,
    search: SupportSearch,
    start_date: startDate,
    end_date: endDate,
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
        <div>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={handleTechSupportSearchChange}
          />
        </div>
      </div>

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
            key: "no",
            width: "5%",
          },
          {
            title: "Support specialist",
            dataIndex: "username",
            render: (text, record) => {
              return record.full_name.trim()
                ? record.full_name
                : record.username;
            },
          },
          {
            title: "Total tasks",
            dataIndex: "number_of_tasks",
          },
        ]}
        pagination={false}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        bordered
      />

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

export default StatisticsTechSupport;
