import { Table } from "antd";
import { TStat } from "../../types/Statistic/TStat";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";

import { theme } from "antd";

const StatTable = ({
  data,
  isLoading,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TStat[], unknown>>;
  data: { data: TStat[] | undefined };
  isLoading: boolean;
}) => {
  const { token } = theme.useToken();

  return (
    <div>
      <Table
        size="small"
        loading={isLoading}
        dataSource={data?.data?.map((u, i) => ({
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
            title: "Points",
            dataIndex: "total_points",
            key: "total_points",
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

export default StatTable;
