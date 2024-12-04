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

import { theme } from "antd";

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

  const { token } = theme.useToken();

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
      bordered
    />
  );
};

export default TeamTable;
