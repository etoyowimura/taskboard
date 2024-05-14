import { Table, Tag } from "antd";
import { useTeamData } from "../../Hooks/Teams";
import { TUser } from "../../types/User/TUser";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
const UserTable = ({
  data,
  isLoading,
  refetch,
}: {
  data: TUser[] | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TUser[], unknown>>;
}) => {
  const navigate = useNavigate();
  const Row = (record: TUser) => {
    let isTextSelected = false;
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (selection !== null && selection.toString() !== "") {
        isTextSelected = true;
      } else {
        isTextSelected = false;
      }
    });
    return {
      onClick: () => {
        if (isTextSelected) {
          return;
        }
        navigate(`/users/${record.id}`);
      },
    };
  };

  return (
    <div>
      <Table
        onRow={(record) => Row(record)}
        dataSource={data?.map((u, i) => ({
          no: i + 1,
          team_name: u?.team?.name,
          role_name: u?.role?.name,
          action: { id: u.id },
          ...u,
        }))}
        loading={isLoading}
        size="middle"
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
          },
          {
            title: "Username",
            dataIndex: "username",
          },
          {
            title: "Team",
            dataIndex: "team_name",
          },
          {
            title: "Role",
            dataIndex: "role_name",
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
            onFilter: (value: any, record: any) => {
              return record.is_active === value;
            },
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
      />
    </div>
  );
};

export default UserTable;
