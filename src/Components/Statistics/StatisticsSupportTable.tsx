import React from "react";
import { Table, Tag, Tooltip } from "antd";
import { theme } from "antd";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { TStatCreators } from "../../types/Statistic/TStat";
import tagIcon from "../../assets/tagIcon.png";

const StatisticsSupportTable = ({
  data,
  isLoading,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TStatCreators[], unknown>>;
  data: TStatCreators[] | undefined;
  isLoading: boolean;
}) => {
  const { token } = theme.useToken();
  return (
    <div style={{ maxHeight: "400px" }}>
      <Table
        loading={isLoading}
        size="small"
        dataSource={data?.map((u, i) => ({
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
        pagination={{
          pageSize: 10,
          size: "default",
          style: {
            margin: 0,
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: token.colorBgContainer,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            padding: "10px 0",
            zIndex: 1000,
          },
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        bordered
      />
    </div>
  );
};

export default StatisticsSupportTable;
