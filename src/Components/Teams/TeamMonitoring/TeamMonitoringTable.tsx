import { Button, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import tagIcon from "../../../assets/tagIcon.svg";
import { TTeam } from "../../../types/Team/TTeam";
import { timeZone } from "../../../App";
import { useState } from "react";
import EditTeamMonitorModal from "./EditTeamMonitorModal";

const TeamMonitoringTable = ({
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
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openEditModal = (id: number) => {
    setSelectedId(id);
    setEditOpen(true);
  };

  return (
    <>
      {editOpen && selectedId && (
        <EditTeamMonitorModal
          open={editOpen}
          id={selectedId}
          onClose={() => setEditOpen(false)}
          onSuccess={() => {
            setEditOpen(false);
            refetch();
          }}
        />
      )}
      <Table
        loading={isLoading}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/teams-monitoring/${record.id}`);
            },
          };
        }}
        dataSource={data?.map((u, i) => ({
          ...u,
          no: i + 1,
          action: { id: u.id },
          created: moment(u?.created_at)
            .tz(timeZone)
            .format("DD.MM.YYYY HH:mm"),
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
          {
            title: "Actions",
            key: "actions",
            align: "center",
            width: "10%",
            render: (_: any, record: TTeam) => (
              <Button
                icon={<EditOutlined />}
                type="default"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(record.id);
                }}
              >
                Edit
              </Button>
            ),
          },
        ]}
        pagination={false}
        bordered
      />
    </>
  );
};

export default TeamMonitoringTable;
