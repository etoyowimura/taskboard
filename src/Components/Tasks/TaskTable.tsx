import { Button, Modal, Space, Table, Tooltip } from "antd";
import "../../App.css";
import { useEffect, useMemo, useState } from "react";
import { taskController } from "../../API/LayoutApi/tasks";
import { TPagination } from "../../types/common/TPagination";
import { TTask } from "../../types/Tasks/TTasks";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseQueryResult,
} from "react-query";
import { TCompany } from "../../types/Company/TCompany";
import { TService } from "../../types/Service/TService";
import { TCustomer } from "../../types/Customer/TCustomer";
import { TUser } from "../../types/User/TUser";
// @ts-ignore
import zippy from "../../assets/zippyicon.svg";
// @ts-ignore
import evo from "../../assets/evoicon.png";
// @ts-ignore
import zeelog from "../../assets/zeelogicon.svg";
// @ts-ignore
import ontime from "../../assets/ontimeicon.svg";
// @ts-ignore
import tt from "../../assets/tticon.svg";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import { role } from "../../App";

const admin_id = localStorage.getItem("admin_id");
const TaskTable = ({
  data,
  isLoading,
  refetch,
  showTaskModal,
}: {
  data: {
    characters: TTask[] | undefined;
    CompanyData: UseQueryResult<TCompany[], unknown>;
    CustomerData: UseQueryResult<TCustomer[], unknown>;
    ServiceData: UseQueryResult<TService[], unknown>;
    AdminData: UseQueryResult<TUser[], unknown>;
  };
  showTaskModal: any;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TPagination<TTask[]>, unknown>>;
}) => {
  const moment = require("moment");
  const statusClick = (record: any) => {
    if (record.status === "New") {
      Modal.confirm({
        title: "Confirmation",
        content: `Are you sure you want to be in charge for this task?`,
        onOk: () => {
          const value = {
            status: "Checking",
          };
          taskController.taskPatch(value, record.id);
        },
      });
    }
    if (record.status === "Checking") {
      Modal.confirm({
        title: "Confirmation",
        content: `Are you sure you want to finish this task?`,
        onOk: () => {
          const value = {
            status: "Done",
          };
          taskController.taskPatch(value, record.id);
        },
      });
    }
  };

  const [isTextSelected, setIsTextSelected] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setIsTextSelected(selection !== null && selection.toString() !== "");
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleRowClick = (record: TTask, event: any) => {
    if (isTextSelected) {
      return;
    }
    if (
      event.target.classList.contains("ant-table-cell") &&
      (record?.in_charge?.id === null ||
        (!!admin_id && record?.in_charge?.id === +admin_id) ||
        role !== "Checker")
    ) {
      showTaskModal(record);
    }
  };

  const getImageSource = (source: string) => {
    switch (source) {
      case "Zippy":
        return zippy;
      case "EVO":
        return evo;
      case "Ontime":
        return ontime;
      case "Zeelog":
        return zeelog;
      case "TT":
        return tt;
      default:
        return tt;
    }
  };

  const rowClassName = (record: TTask) => {
    if (record.status === "New") {
      return "new-status-row";
    }
    return "";
  };

  const columns = useMemo(() => {
    const columns = [
      {
        title: <img src={tagIcon} alt="" />,
        dataIndex: "no",
        width: "5%",
      },
      {
        title: "Company",
        dataIndex: "company",
        width: "13%",
        responsive: ["xl"],
        ellipsis: {
          showTitle: true,
        },
        render: (text: any, record: any) => (
          <Tooltip placement="topLeft" title={text?.name}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {text?.source && (
                <img
                  src={getImageSource(text?.source)}
                  alt=""
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
              )}
              {text?.name}
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Driver",
        dataIndex: "customer",
        width: "13%",
        ellipsis: {
          showTitle: false,
        },
        render: (item: { name: string; id: number }) => (
          <Tooltip placement="topLeft" title={item?.name}>
            {item?.name}
          </Tooltip>
        ),
      },
      {
        title: "Service",
        dataIndex: "service",
        width: "7%",
        ellipsis: {
          showTitle: false,
        },
        render: (item: { title: string; id: number }) => (
          <Tooltip placement="topLeft" title={item?.title}>
            {item.title}
          </Tooltip>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        width: "8%",
        ellipsis: {
          showTitle: false,
        },
        render: (status: string) => (
          <span>
            {status === "Done" && <p className="status-done">Done</p>}
            {status === "Checking" && (
              <p className="status-in-progress">Checking</p>
            )}
            {status === "New" && <p className="status-new">New</p>}
          </span>
        ),
      },
      {
        title: "Team",
        dataIndex: "assigned_to",
        width: "8%",
        ellipsis: {
          showTitle: false,
        },
        render: (item: { name: string }) => (
          <Tooltip placement="topLeft" title={item?.name}>
            {item?.name}
          </Tooltip>
        ),
      },
      {
        title: "Assignee",
        dataIndex: "in_charge",
        width: "12%",
        ellipsis: {
          showTitle: false,
        },
        render: (item: { username: string }) => (
          <Tooltip placement="topLeft" title={item?.username}>
            {item?.username}
          </Tooltip>
        ),
      },
      {
        title: "PTI",
        dataIndex: "pti",
        width: "6%",
        responsive: ["lg"],
        render: (pti: boolean) => (pti ? "No need" : "Do"),
      },
      {
        title: "Note",
        dataIndex: "note",
        width: "12%",
        responsive: ["lg"],
        ellipsis: {
          showTitle: false,
        },
        render: (note: string) => (
          <Tooltip placement="topLeft" title={note}>
            {note}
          </Tooltip>
        ),
      },
      {
        title: "Created at",
        dataIndex: "created",
        width: "12%",
        responsive: ["xxl"],
        ellipsis: {
          showTitle: false,
        },
        render: (note: string) => (
          <Tooltip placement="topLeft" title={note}>
            {note}
          </Tooltip>
        ),
      },
      {
        title: "Actions",
        dataIndex: "action",
        width: "8%",
        render: (text: string, record: TTask) => {
          return (
            <div>
              {role === "Checker" ? (
                <Space>
                  {record.status === "New" && (
                    <Button
                      type="primary"
                      style={{ background: "#595959" }}
                      onClick={() => statusClick(record)}
                    >
                      Assign
                    </Button>
                  )}
                  {record.status === "Checking" &&
                    !!admin_id &&
                    record?.in_charge?.id === +admin_id && (
                      <Button
                        type="primary"
                        style={{ background: "#595959" }}
                        onClick={() => statusClick(record)}
                      >
                        Finish
                      </Button>
                    )}
                </Space>
              ) : (
                <Space>
                  <Button
                    type="primary"
                    danger
                    onClick={(e) => {
                      const shouldDelete = window.confirm(
                        "Are you sure, you want to delete this task?"
                      );
                      if (shouldDelete && record.id !== undefined) {
                        taskController.deleteTaskController(record.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            </div>
          );
        },
      },
    ];

    if (role === "Checker") {
      const teamColIndex = columns.findIndex((c) => c.title === "Team");

      teamColIndex !== -1 && columns.splice(teamColIndex, 1);
    }

    return columns;
  }, [role]);

  return (
    <div>
      <Table
        onRow={(record: any) => ({
          onClick: (event) => handleRowClick(record, event),
        })}
        dataSource={data?.characters?.map((u, i) => ({
          ...u,
          no: i + 1,
          created: moment(u?.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD.MM.YYYY HH:mm"
          ),
          key: u?.id,
        }))}
        size="small"
        columns={columns as any}
        pagination={false}
        loading={isLoading}
        rowClassName={rowClassName}
        bordered
      />
    </div>
  );
};

export default TaskTable;
