import { TTask } from "../../types/Tasks/TTasks";
import {
  Dropdown,
  MenuProps,
  Modal,
  Table,
  Tabs,
  Tooltip,
  message,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { role, timeZone } from "../../App";
import { useTaskHistory } from "../../Hooks/Tasks";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { taskController } from "../../API/LayoutApi/tasks";
import { useTeamData } from "../../Hooks/Teams";
import { TTeam } from "../../types/Team/TTeam";
import { EditOutlined } from "@ant-design/icons";
import { TSocket } from "../../types/common/TSocket";
// @ts-ignore
import closeIcon from "../../assets/closeIcon.png";
// @ts-ignore
import editIcon from "../../assets/editIcon.png";
// @ts-ignore
import historyIcon from "../../assets/hisoryIcon.png";
// @ts-ignore
import attachmentIcon from "../../assets/attachmentIcon.png";
// @ts-ignore
import infoIcon from "../../assets/infoIcon.png";
// @ts-ignore
import uploadIcon from "../../assets/uploadIcon.png";
// @ts-ignore
import pdficon from "../../assets/pdficon.png";
// @ts-ignore
import letssee from "../../assets/letssee.png";
// @ts-ignore
import svgicon from "../../assets/svgicon.png";
// @ts-ignore
import pngicon from "../../assets/pngicon.png";
// @ts-ignore
import jpgicon from "../../assets/jpgicon.png";
// @ts-ignore
import jpegicon from "../../assets/jpegicon.png";
// @ts-ignore
import xlsicon from "../../assets/xlsicon.png";
// @ts-ignore
import docicon from "../../assets/docicon.png";
// @ts-ignore
import forwardIcon from "../../assets/forward.png";
// @ts-ignore
import driverIcon from "../../assets/drivericon.png";
// @ts-ignore
import userIcon from "../../assets/userIcon.png";

const TaskModal = ({
  modalOpen,
  setModalOpen,
  recordTask,
  setRecordTask,
  uploadOpen,
  setUploadOpen,
  socketData,
}: {
  recordTask: TTask | undefined;
  setRecordTask: React.Dispatch<React.SetStateAction<TTask | undefined>>;
  modalOpen: boolean;
  setModalOpen: any;
  uploadOpen: boolean;
  setUploadOpen: any;
  socketData: TSocket | undefined;
}) => {
  const moment = require("moment-timezone");
  const theme = localStorage.getItem("theme") === "true" ? true : false;
  const [text, setText] = useState<string | undefined>(recordTask?.note);
  const [pti, setPti] = useState<boolean | undefined>(recordTask?.pti);
  const [status, setStatus] = useState(recordTask?.status);
  const [teamName, setTeamName] = useState(recordTask?.assigned_to?.name);
  const { data, isLoading } = useTaskHistory(recordTask?.id);

  const handleCancel = () => {
    setModalOpen(!modalOpen);
  };
  const showUploadModal = () => {
    setUploadOpen(!uploadOpen);
  };

  function getFileType(fileName: any) {
    var fileExtension = fileName.split(".").pop()?.toLowerCase();

    switch (fileExtension) {
      case "jpg":
        return <img style={{ marginRight: 12 }} src={jpgicon} alt="" />;
      case "jpeg":
        return <img style={{ marginRight: 12 }} src={jpegicon} alt="" />;
      case "png":
        return <img style={{ marginRight: 12 }} src={pngicon} alt="" />;
      case "pdf":
        return <img style={{ marginRight: 12 }} src={pdficon} alt="" />;
      case "svg":
        return <img style={{ marginRight: 12 }} src={svgicon} alt="" />;
      case "xls":
        return <img style={{ marginRight: 12 }} src={xlsicon} alt="" />;
      default:
        return <img style={{ marginRight: 12 }} src={docicon} alt="" />;
    }
  }

  const teamData = useTeamData("");
  // const teamData = useCustomerData({name: "", page: 1, page_size: 100});
  const teams: MenuProps["items"] = teamData?.data?.map((item, index) => ({
    key: item?.id,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            background: `rgb(${index * (255 / teamData?.data.length)}, ${
              255 - index * (255 / teamData?.data.length)
            }, 0)`,
            padding: 5,
            borderRadius: 5,
            marginRight: 10,
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p>{item?.name}</p>
          <p style={{ marginLeft: 30 }}>{item?.task_count_percentage}%</p>
        </div>
      </div>
    ),
    onClick: () => teampatch(item),
  }));
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <p>New</p>,
      onClick: () => statuspatch("New"),
    },
    {
      key: "2",
      label: <p>Checking</p>,
      onClick: () => statuspatch("Checking"),
    },
    {
      key: "3",
      label: <p>Done</p>,
      onClick: () => statuspatch("Done"),
    },
  ];
  const getImageSource = (source: string) => {
    switch (source) {
      case "driver":
        return driverIcon;
      case "user":
        return userIcon;
      default:
        return userIcon;
    }
  };

  const statuspatch = (status: string) => {
    setStatus(status);
    taskController.taskPatch({ status: status }, recordTask?.id).then(() => {
      message.success({ content: "Success", duration: 1 });
    });
  };

  const teampatch = (item: TTeam) => {
    setTeamName(item?.name);
    taskController
      .taskPatch({ assigned_to_id: item?.id }, recordTask?.id)
      .then(() => {
        message.success({
          content: "Task forwarded successfully",
          duration: 1,
        });
        setModalOpen(false);
      });
  };

  const patchTask = () => {
    taskController
      .taskPatch({ note: text, pti: pti }, recordTask?.id)
      .then(() => {
        message.success({ content: "Saved!" });
      });
    setModalOpen(!modalOpen);
  };

  // const nextStatus = (status : string) => {
  //   console.log();
  // }

  useEffect(() => {
    if (socketData && socketData.task) {
      if (
        socketData.type === "task_update" &&
        socketData.task.id === recordTask?.id
      ) {
        setRecordTask(socketData.task);
      }
    }
  }, [socketData]);

  return (
    <Modal
      onCancel={handleCancel}
      footer={null}
      open={modalOpen}
      width={800}
      maskClosable={true}
      // style={{ position: "fixed", right: 0, top: 0, bottom: 0, height: 1000 }}
    >
      <div className={!theme ? "TaskModal-header" : "TaskModal-header-dark"}>
        <div className={!theme ? "TaskModal-title" : "TaskModal-title-dark"}>
          <p className={!theme ? "p-driver" : "p-driver-dark"}>
            {recordTask?.customer?.name}
          </p>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
            disabled={role === "Checker" && status === "Done"}
          >
            <button
              style={{ marginLeft: 12, display: "flex", alignItems: "center" }}
              className={`status-${status}`}
            >
              {status}
              <EditOutlined style={{ marginLeft: 4 }} />
            </button>
            {/* <button onClick={e > nextStatus(status)}>
              <CaretRightOutlined /> 
            </button> */}
          </Dropdown>
        </div>
        <div className="mdoal-actions">
          <Dropdown
            disabled={recordTask?.status !== "New"}
            menu={{ items: teams }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <button
              disabled={recordTask?.status !== "New"}
              style={{ marginRight: 12 }}
              className={`btn-modal-action-${theme && "dark"}`}
            >
              <img src={forwardIcon} alt="" />
              Forward
            </button>
          </Dropdown>
          <button
            style={{ marginLeft: 12 }}
            className={`btn-modal-action-${theme && "dark"}`}
            onClick={showUploadModal}
          >
            <img src={uploadIcon} alt="" />
            Upload file
          </button>
          <button
            onClick={handleCancel}
            style={{ marginLeft: 20 }}
            className={`btn-modal-action-${theme && "dark"}`}
          >
            <img style={{ margin: 2 }} src={closeIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="TaskModal-content">
        <Tabs style={{ marginLeft: 24 }}>
          <TabPane
            tab={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img style={{ marginRight: 10 }} src={infoIcon} alt="" />
                Information
              </span>
            }
            key="1"
          >
            <div className="info-div">
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: "24px",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                Information
              </p>
              <div className="info-body">
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Comapany</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {recordTask?.company?.name}
                  </p>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Driver</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {recordTask?.customer?.name}
                  </p>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Service</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {recordTask?.service?.title}
                  </p>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Team</p>
                  <p className={!theme ? "info" : "info-dark"}>{teamName}</p>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Assignee</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {recordTask?.in_charge?.username}
                  </p>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>PTI</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {pti === false ? "Do" : "No need"}
                  </p>
                  <button
                    style={{
                      marginLeft: 10,
                      background: "#cecece",
                      outline: "none",
                      border: "1px solid rgba(246, 137, 0, 1)",
                      padding: 4,
                      borderRadius: 4,
                    }}
                    onClick={(e) => setPti(!pti)}
                  >
                    change
                  </button>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Created at</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {moment(
                      recordTask?.created_at,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("DD.MM.YYYY HH:mm")}
                  </p>
                </tr>
              </div>
              <div style={{ marginTop: 20 }}>
                <label className={!theme ? "sub" : "sub-dark"}>Note:</label>
                <TextArea
                  style={{ padding: "7px 11px", marginTop: 10 }}
                  placeholder="Description"
                  defaultValue={text}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <button
                style={{ marginTop: 20 }}
                className={`btn-modal-action-${theme && "dark"}`}
                onClick={(e) => patchTask()}
              >
                <img src={editIcon} alt="" />
                Save
              </button>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span style={{ display: "flex", alignItems: "center" }}>
                <img style={{ marginRight: 10 }} src={attachmentIcon} alt="" />
                Attachments
              </span>
            }
            key="2"
          >
            <div className="info-div">
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: "24px",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                Attachments
              </p>
            </div>
            <Table
              size="small"
              style={{ margin: "0 12px" }}
              dataSource={recordTask?.attachment_set?.map((u, i) => ({
                no: i + 1,
                ...u,
                created: moment(u?.created_at)
                  ?.tz(timeZone)
                  ?.format("DD.MM.YYYY HH:mm"),
                action: { ...u },
                by: u,
              }))}
              columns={[
                {
                  title: "User/Driver",
                  dataIndex: "by",
                  width: "25%",
                  key: 1,
                  ellipsis: {
                    showTitle: false,
                  },
                  render: (text: any) => (
                    <Tooltip
                      placement="topLeft"
                      title={
                        text?.uploaded_by_which_driver?.username ||
                        text?.uploaded_by_which_user?.username
                      }
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {text?.uploaded_by_which_user ? (
                          <>
                            <img
                              src={getImageSource("user")}
                              alt=""
                              style={{ width: 15, height: 15, marginRight: 10 }}
                            />
                            <p>
                              {text?.uploaded_by_which_user?.username
                                ? text?.uploaded_by_which_user?.username
                                : ""}
                            </p>
                          </>
                        ) : (
                          <>
                            <img
                              src={getImageSource("driver")}
                              alt=""
                              style={{ width: 20, height: 15, marginRight: 10 }}
                            />
                            <p>
                              {text?.uploaded_by_which_driver?.name
                                ? text?.uploaded_by_which_driver?.name
                                : ""}
                            </p>
                          </>
                        )}
                      </div>
                    </Tooltip>
                  ),
                },
                {
                  title: "Name/Description",
                  dataIndex: "file_name",
                  width: "30%",
                  key: 1,
                  ellipsis: {
                    showTitle: false,
                  },
                },
                {
                  title: "Uploaded date",
                  dataIndex: "created",
                  key: 2,
                  width: "30%",
                  ellipsis: {
                    showTitle: false,
                  },
                },
                {
                  title: "Attachments",
                  dataIndex: "action",
                  key: 3,
                  width: "40%",
                  render: (text, record) => {
                    return (
                      <a
                        href={record?.path}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "6px 10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 8,
                          color: !theme ? "rgba(15, 17, 28, 1)" : "#bbb",
                          border: "1px solid rgba(215, 216, 224, 1)",
                          boxShadow: "0px 1px 3px 0px rgba(20, 22, 41, 0.1)",
                        }}
                      >
                        {getFileType(record?.file_name)}
                        <span style={{ overflow: "hidden" }}>
                          {record?.file_name}
                        </span>
                        <img
                          src={letssee}
                          alt=""
                          style={{ textAlign: "right" }}
                        />
                      </a>
                    );
                  },
                  ellipsis: {
                    showTitle: false,
                  },
                },
              ]}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "even-row" : "odd-row"
              }
            />
          </TabPane>
          <TabPane
            tab={
              <span style={{ display: "flex", alignItems: "center" }}>
                <img style={{ marginRight: 10 }} src={historyIcon} alt="" />
                History
              </span>
            }
            key="3"
          >
            <div className="info-div">
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: "24px",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                History
              </p>
            </div>
            <Table
              style={{ margin: "0 24px" }}
              loading={isLoading}
              size="small"
              dataSource={data?.map((u, i) => ({
                no: i + 1,
                ...u,
                by: u.user
                  ? { user: u?.user?.username }
                  : { driver: u?.driver?.name },
                created: moment(u?.timestamp)
                  ?.tz(timeZone)
                  ?.format("DD.MM.YYYY HH:mm"),
              }))}
              columns={[
                {
                  title: "User/Driver",
                  dataIndex: "by",
                  width: "25%",
                  key: 1,
                  ellipsis: {
                    showTitle: false,
                  },
                  render: (text: any, record: any) => (
                    <Tooltip
                      placement="topLeft"
                      title={text?.user || text?.driver}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {text?.user ? (
                          <>
                            <img
                              src={getImageSource("user")}
                              alt=""
                              style={{ width: 15, height: 15, marginRight: 10 }}
                            />
                            <p>
                              {typeof text?.user === "string" ? text?.user : ""}
                            </p>
                          </>
                        ) : (
                          <>
                            <img
                              src={getImageSource("driver")}
                              alt=""
                              style={{ width: 20, height: 15, marginRight: 10 }}
                            />
                            <p>
                              {typeof text.driver === "string"
                                ? text.driver
                                : ""}
                            </p>
                          </>
                        )}
                      </div>
                    </Tooltip>
                  ),
                },
                {
                  title: "Action",
                  dataIndex: "action",
                  width: "15%",
                  key: 2,
                  ellipsis: {
                    showTitle: false,
                  },
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  width: "40%",
                  key: 3,
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
                  title: "Timestamp",
                  dataIndex: "created",
                  key: 4,
                  width: "20%",
                  ellipsis: {
                    showTitle: false,
                  },
                },
              ]}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "even-row" : "odd-row"
              }
            />
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default TaskModal;
