import React from "react";
import { Table, Tag, Tooltip } from "antd";
import { theme } from "antd";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { TStatCreators } from "../../types/Statistic/TStat";
import tagIcon from "../../assets/tagIcon.svg";

const StatisticsSupportTable = ({
  data,
  isLoading,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TStatCreators[], unknown>>;
  data: any;
  isLoading: boolean;
}) => {
  const { token } = theme.useToken();
  return (
    <div style={{ paddingBottom: 40 }}>
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
        // pagination={{
        //   pageSize: 10,
        //   size: "default",
        //   style: {
        //     margin: 0,
        //     justifyContent: "end",
        //     position: "fixed",
        //     bottom: 0,
        //     left: 0,
        //     width: "100%",
        //     backgroundColor: token.colorBgContainer,
        //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
        //     padding: "10px 0",
        //     zIndex: 1000,
        //   },
        //   showLessItems: true,
        // }}
        pagination={false}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        bordered
      />
    </div>
  );
};

export default StatisticsSupportTable;
