import { Table } from "antd";
import { TStat } from "../../types/Statistic/TStat";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
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
          pageSize: 14,
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
      />
    </div>
  );
};

export default StatTable;
