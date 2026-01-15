import { Button, message, Modal, Space, Table, Tooltip } from "antd";
import ReactCountryFlag from "react-country-flag";
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
import tagIcon from "../../assets/tagIcon.svg";
// @ts-ignore
import tgIcon from "../../assets/telegram.png";

import webIcon from "../../assets/web.png";

import { isMobile, role } from "../../App";

import { theme } from "antd";

import ShiftAndCoDriverCreateModal from "./ShiftInfo/ShiftAndCoDriverCreateModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordTask, setRecordTask] = useState<TTask | null>(null);

  const statusClick = async (record: any) => {
    if (record.status === "New") {
      Modal.confirm({
        title: "Confirmation",
        content: `Are you sure you want to be in charge for this task?`,
        onOk: () => {
          const value = {
            status: "Checking",
          };
          taskController.taskPatch(value, record?.id).then((response: any) => {
            if (response?.status === 403) {
              showErrorModal(response);
            }
          });
        },
      });
    }
    // if (record.status === "Checking") {
    //   Modal.confirm({
    //     title: "Confirmation",
    //     content: `Are you sure you want to finish this task?`,
    //     onOk: () => {
    //       const value = {
    //         status: "Done",
    //       };
    //       taskController.taskPatch(value, record.id).then(() => {
    //         setErrorModal(false);
    //       });
    //     },
    //   });
    // }

    if (record.status === "Checking") {
      // 1) Break / PTI
      if (
        record?.service?.title === "Break" ||
        record?.service?.title === "PTI"
      ) {
        const response = await taskController.taskPatch(
          { status: "Done" },
          record.id
        );
        if (response?.status === 400) {
          setRecordTask(record);
          setIsModalOpen(true);
        }
        return;
      }

      // 2) needs_extra_info false
      if (record?.company?.needs_extra_info === false) {
        const response = await taskController.taskPatch(
          { status: "Done" },
          record.id
        );
        if (response?.status === 400) {
          setRecordTask(record);
          setIsModalOpen(true);
        }
        return;
      }

      setRecordTask(record);
      setIsModalOpen(true);
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

  const handleCopy = (record: any, lang: "en" | "ru") => {
    const shiftInfo = {
      shiftDate: record?.shift_date,
      shiftLocation: record?.shift_location ?? null,
      cycleDate: record?.cycle_date,
      cycleLocation: record?.cycle_location ?? null,
      pickUpDate: record?.pickup_date,
      pickUpTime: record?.pickup_time,
      pickUpLocation: record?.pickup_location ?? null,
    };

    const coDriverInfo = {
      driverName: record?.driver_name ?? null,
      coDriverName: record?.co_driver_name ?? null,
      coDriverPickUpDate: record?.co_driver_pickup_date,
      coDriverPickUpTime: record?.co_driver_pickup_time,
      coDriverPickUpLocation: record?.co_driver_pickup_location ?? null,
      coDriverDropDate: record?.co_driver_drop_date,
      coDriverDropTime: record?.co_driver_drop_time,
      coDriverDropLocation: record?.co_driver_drop_location ?? null,
    };

    const buildTextBlock = (
      title: string,
      items: [string, string | null][]
    ) => {
      const lines = items
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}`);
      return lines.length ? `${title}\n${lines.join("\n")}` : "";
    };

    let text = "";

    if (lang === "en") {
      text = [
        buildTextBlock("SHIFT INFO ❗️❗️❗️", [
          ["Shift Date", shiftInfo.shiftDate],
          ["Shift Location", shiftInfo.shiftLocation],
          ["Cycle Date", shiftInfo.cycleDate],
          ["Cycle Location", shiftInfo.cycleLocation],
          ["Pick up Date", shiftInfo.pickUpDate],
          ["Pick up Time", shiftInfo.pickUpTime],
          ["Pick Up Location", shiftInfo.pickUpLocation],
        ]),
        buildTextBlock("CO DRIVER INFO", [
          ["Driver's name", coDriverInfo.driverName],
          ["Co-Driver's name", coDriverInfo.coDriverName],
          ["Co-driver pickup date", coDriverInfo.coDriverPickUpDate],
          ["Co-driver pickup time", coDriverInfo.coDriverPickUpTime],
          ["Co-driver pickup location", coDriverInfo.coDriverPickUpLocation],
          ["Co-driver drop date", coDriverInfo.coDriverDropDate],
          ["Co-driver drop time", coDriverInfo.coDriverDropTime],
          ["Co-driver drop location", coDriverInfo.coDriverDropLocation],
        ]),
      ]
        .filter(Boolean)
        .join("\n\n");
    } else {
      text = [
        buildTextBlock("ИНФОРМАЦИЯ О СМЕНЕ ❗️❗️❗️", [
          ["Дата шифта", shiftInfo.shiftDate],
          ["Место шифта", shiftInfo.shiftLocation],
          ["Дата сайкла", shiftInfo.cycleDate],
          ["Место сайкла", shiftInfo.cycleLocation],
          ["Дата пикапа", shiftInfo.pickUpDate],
          ["Время пикапа", shiftInfo.pickUpTime],
          ["Место пикапа", shiftInfo.pickUpLocation],
        ]),
        buildTextBlock("ИНФОРМАЦИЯ О КО-ДРАЙВЕРЕ", [
          ["Имя драйвера", coDriverInfo.driverName],
          ["Имя ко-драйвера", coDriverInfo.coDriverName],
          ["Дата пикапа ко-драйвера", coDriverInfo.coDriverPickUpDate],
          ["Время пикапа ко-драйвера", coDriverInfo.coDriverPickUpTime],
          ["Место пикапа ко-драйвера", coDriverInfo.coDriverPickUpLocation],
          ["Дата высадки ко-драйвера", coDriverInfo.coDriverDropDate],
          ["Время высадки ко-драйвера", coDriverInfo.coDriverDropTime],
          ["Место высадки ко-драйвера", coDriverInfo.coDriverDropLocation],
        ]),
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Data copied successfully!"))
      .catch(() => message.error("Failed to copy!"));
  };

  const columns = useMemo(() => {
    const columns = [
      // {
      //   title: "",
      //   dataIndex: "no",
      //   width: isMobile ? "1%" : "3.5%",
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
      //       )
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
        title: "Service Team",
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
        title: "Monitoring Team",
        dataIndex: "team_monitoring",
        width: isMobile ? "3%" : "8%",
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
        width: "7%",
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
        width: "10%",
        key: "10",
        // responsive: ["xxl"],
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
        title: "Source",
        dataIndex: "source",
        width: "6%",
        key: "1",
        ellipsis: {
          showTitle: false,
        },
        render: (text: any, record: TTask) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {record?.via_telegram ? (
              <Tooltip placement="topLeft" title={"Created via Telegram"}>
                <img src={tgIcon} alt="" style={{ width: 20, height: 20 }} />
              </Tooltip>
            ) : (
              <Tooltip placement="topLeft" title={"Created via Taskboard"}>
                <img src={webIcon} alt="" style={{ width: 20, height: 20 }} />
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        title: (
          <Tooltip placement="topLeft" title={"Copy shift data"}>
            Copy
          </Tooltip>
        ),
        width: "8%",
        render: (text: any, record: TTask) => (
          <>
            {record?.company?.needs_extra_info && record?.status === "Done" && (
              <>
                <Button onClick={() => handleCopy(record, "en")} type="text">
                  <Tooltip
                    placement="topLeft"
                    title={"Copy shift data in English"}
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{
                        width: "1.2em",
                        height: "1.2em",
                      }}
                    />
                  </Tooltip>
                </Button>
                <Button onClick={() => handleCopy(record, "ru")} type="text">
                  <Tooltip
                    placement="topLeft"
                    title={"Copy shift data in Russian"}
                  >
                    <ReactCountryFlag
                      countryCode="RU"
                      svg
                      style={{
                        width: "1.2em",
                        height: "1.2em",
                      }}
                    />
                  </Tooltip>
                </Button>
              </>
            )}
          </>
        ),
      },
      {
        title: "Actions",
        dataIndex: "action",
        width: "10%",
        key: "11",
        fixed: isMobile ? "right" : false,
        render: (text: string, record: TTask) => {
          return (
            <div style={{ zIndex: 1000 }}>
              <Space>
                {role === "Checker" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
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
                  </>
                )}
              </Space>
            </div>
          );
        },
      },
    ];

    if (role === "Checker") {
      const forbiddenTitles = ["Service Team", "Monitoring Team"];

      forbiddenTitles.forEach((title) => {
        const index = columns.findIndex(
          (c) => typeof c.title === "string" && c.title === title
        );

        if (index !== -1) {
          columns.splice(index, 1);
        }
      });
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
        scroll={{ x: "800px" }}
        bordered
        pagination={false}
      />

      <ShiftAndCoDriverCreateModal
        recordTask={recordTask}
        open={isModalOpen}
        onOk={(values) => {
          if (recordTask?.id) {
            const payload = { status: "Done", ...values };
            taskController
              .taskPatch(payload, recordTask.id)
              .then((response: any) => {
                if (response?.status === 403) {
                  showErrorModal(response);
                } else {
                  setIsModalOpen(false);
                }
              });
          }
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TaskTable;
