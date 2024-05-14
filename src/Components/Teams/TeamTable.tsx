import { Table, Tag } from "antd";
import { TTeam } from "../../types/Team/TTeam";
import { useNavigate } from "react-router-dom";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { timeZone } from "../../App";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
const TeamTable = ({
  data,
  isLoading,
  refetch,
}: {
  data: TTeam[] | undefined;
  isLoading: boolean | undefined;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TTeam[], unknown>>;
}) => {
  const navigate = useNavigate();
  const moment = require("moment-timezone");

  return (
    <Table
      loading={isLoading}
      onRow={(record) => {
        return {
          onClick: () => {
            navigate(`/teams/${record.id}`);
          },
        };
      }}
      dataSource={data?.map((u, i) => ({
        ...u,
        no: i + 1,
        action: { id: u.id },
        created: moment(u?.created_at).tz(timeZone).format("DD.MM.YYYY HH:mm"),
        key: u.id,
      }))}
      size="middle"
      columns={[
        {
          title: <img src={tagIcon} alt="" />,
          dataIndex: "no",
          width: "5%",
        },
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Created at",
          dataIndex: "created",
        },
      ]}
    />
  );
};

export default TeamTable;
