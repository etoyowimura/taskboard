import { Table, Tag } from "antd";
import { TStatTeam } from "../../types/Statistic/TStat";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";

import { theme } from "antd";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.svg";
const StatTeamTable = ({
  data,
  isLoading,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TStatTeam[], unknown>>;
  data: any;
  isLoading: boolean;
}) => {
  const { token } = theme.useToken();
  return (
    <div style={{ maxHeight: "400px", overflow: "auto" }}>
      <Table
        loading={isLoading}
        size="small"
        dataSource={data?.map((u: any, i: any) => ({
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
            onFilter: (value: string | number | boolean, record: TStatTeam) => {
              return record.is_active === value;
            },
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
        // }}
        pagination={false}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
      />
    </div>
  );
};

export default StatTeamTable;
