import { Table, Tag } from "antd";
import { TStatTeam } from "../../types/Statistic/TStat";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
const StatTeamTable = ({
  data,
  isLoading,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TStatTeam[], unknown>>;
  data: TStatTeam[] | undefined;
  isLoading: boolean;
}) => {
  return (
    <div style={{ maxHeight: "400px", overflow: "auto" }}>
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
          },
          {
            title: "Team",
            dataIndex: "name",
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
        pagination={{
          pageSize: 5,
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
      />
    </div>
  );
};

export default StatTeamTable;
