import { Button, Modal, Space, Table, Tooltip } from "antd";
import "../../App.css";
import { useEffect, useMemo, useState } from "react";
import { taskController } from "../../API/LayoutApi/tasks";
import { TTask } from "../../types/Tasks/TTasks";

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
// @ts-ignore
import tgIcon from "../../assets/telegram.png";
import { isMobile, role } from "../../App";

import { theme } from "antd";

const admin_id = localStorage.getItem("admin_id");
const TaskTable = ({
  data,
  isLoading,
  showTaskModal,
  showErrorModal,
  setErrorModal,
}: {
  data: {
    characters: TTask[] | undefined;
  };
  showTaskModal: any;
  showErrorModal: any;
  isLoading: boolean;
  setErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
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
          taskController.taskPatch(value, record?.id).then((response: any) => {
            if (response?.status == 403) {
              showErrorModal(response);
            }
          });
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
          taskController.taskPatch(value, record.id).then(() => {
            setErrorModal(false);
          });
        },
      });
    }
  };
  const ptiPatch = (record: TTask) => {
    Modal.confirm({
      title: "Confirmation",
      content: `Are you sure you want to change PTI?`,
      onOk: () => {
        taskController.taskPatch({ pti: !record.pti }, record.id);
      },
    });
  };

  const [isTextSelected, setIsTextSelected] = useState(false);

  const { token } = theme.useToken();

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
      // {
      //   title: "",
      //   dataIndex: "no",
      //   width: isMobile ? "1%" : "3.5%",
      //   fixed: isMobile ? "left" : false,
      //   key: "1",
      //   render: (text: any, record: TTask) => (
      //     <div
      //       style={{
      //         display: "flex",
      //         alignItems: "center",
      //         justifyContent: "space-around",
      //       }}
      //     >
      //       {record?.via_telegram && (
      //         <Tooltip placement="topLeft" title={"Created via Telegram"}>
      //           <img src={tgIcon} alt="" style={{ width: 20, height: 20 }} />
      //         </Tooltip>
      //       )}
      //     </div>
      //   ),
      // },
      {
        title: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <img src={tagIcon} alt="" />
          </div>
        ),
        dataIndex: "no",
        width: isMobile ? "1%" : "3.5%",
        fixed: isMobile ? "left" : false,
        key: "2",
        render: (text?: any, record?: TTask) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {text}
          </div>
        ),
      },
      {
        title: "Company",
        dataIndex: "company",
        width: "13%",
        key: "3",
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
        width: isMobile ? "5%" : "13%",
        key: "4",
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
        width: isMobile ? "5%" : "7%",
        align: "center",
        key: "5",
        ellipsis: {
          showTitle: false,
        },
        render: (item?: { title?: string; id: number }, record?: TTask) => (
          <Tooltip placement="topLeft" title={item?.title}>
            {item?.title === "Break" || item?.title === "PTI" ? (
              <p className="status-Rejected">{item?.title}</p>
            ) : (
              <p style={{ textAlign: "center" }}>{item?.title}</p>
            )}
          </Tooltip>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        width: isMobile ? "5%" : "8%",
        align: "center",
        key: "6",
        ellipsis: {
          showTitle: false,
        },
        render: (status?: string) => (
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
        width: isMobile ? "3%" : "7%",
        key: "7",
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
        width: isMobile ? "4%" : "9%",
        key: "8",
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
        width: "8%",
        key: "8",
        responsive: ["lg"],
        render: (pti: boolean, record: TTask) =>
          pti ? (
            <p onClick={(e) => ptiPatch(record)} className="status-Assigned">
              No need
            </p>
          ) : (
            <p onClick={(e) => ptiPatch(record)} className="status-Rejected">
              Do
            </p>
          ),
      },
      {
        title: "Note",
        dataIndex: "note",
        width: "10%",
        key: "9",
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
        key: "10",
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
        width: isMobile ? "3%" : "10%",
        key: "11",
        fixed: isMobile ? "right" : false,
        render: (text: string, record: TTask) => {
          return (
            <div style={{ zIndex: 1000 }}>
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

  const dataSource = data?.characters?.map((u, i) => {
    const createdMoment = moment(u?.created_at, "YYYY-MM-DD HH:mm:ss");
    const isToday = createdMoment.isSame(moment(), "day");

    return {
      ...u,
      no: i + 1,
      created: isToday
        ? `Today at ${createdMoment.format("HH:mm")}`
        : createdMoment.format("DD.MM.YYYY HH:mm"),
      key: u?.id,
    };
  });

  return (
    <div>
      <Table
        onRow={(record: any) => ({
          onClick: (event) => handleRowClick(record, event),
        })}
        dataSource={dataSource}
        size="small"
        columns={columns as any}
        loading={isLoading}
        rowClassName={rowClassName}
        scroll={{ x: "768px" }}
        bordered
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
      />
    </div>
  );
};

export default TaskTable;
