import { useCallback, useEffect, useRef, useState } from "react";
import AddTask from "./AddTask";
import { Button, Input, Select, Space, notification } from "antd";
import TaskTable from "./TaskTable";
import { useTeamData } from "../../Hooks/Teams";
import { StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { useTasks } from "../../Hooks/Tasks";
import { TTask } from "../../types/Tasks/TTasks";
import { admin_id, role, team_id } from "../../App";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
//@ts-ignore
import refreshicon from "../../assets/refreshIcon.png";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
import TaskModal from "./TaskModal";
import TaskUploadModal from "./TaskUploadModal";
import { NotificationPlacement } from "antd/es/notification/interface";
import { TCall } from "../../types/CallRequests/TCall";

const { Option } = Select;
const Task = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [characters, setCharacters] = useState<TTask[] | undefined>();
  const [team, setTeam] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<any>();
  const [page, setPage] = useState<any>(1);
  const [uploadOpen, setUploadOpen] = useState(false);

  let taskSocket: WebSocket;
  interface newData {
    callback_request: TCall;
    type: string;
    task: TTask;
  }

  const [isLive, setIslive] = useState(true);
  const [socketData, setSocketData] = useState<newData>();
  const connect = async () => {
    try {
      if (!taskSocket || taskSocket.readyState === WebSocket.CLOSED) {
        taskSocket = new WebSocket(
          `ws://10.10.10.45:8080/tasks/?user_id=${admin_id}`
        );
        // taskSocket = new WebSocket(
        //   `wss://api.tteld.co/tasks/?user_id=${admin_id}`
        // );

        taskSocket.addEventListener("open", (event) => {
          console.log("open");
          setIslive(true);
        });
        taskSocket.addEventListener("message", (event) => {
          const newData: newData = JSON.parse(event.data);
          setSocketData(newData);
        });
        taskSocket.addEventListener("error", (errorEvent) => {
          console.error("WebSocket error:", errorEvent);
        });

        taskSocket.addEventListener("close", (event) => {
          setIslive(false);
          console.log("close");
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    connect();
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = useCallback(
    (placement: NotificationPlacement, data: TCall) => {
      console.log(data);

      api.info({
        message: `Driver ${data?.driver?.name} from ${data?.company?.name} company has made a call request`,
        placement,
      });
    },
    [api]
  );

  useEffect(() => {
    if (
      socketData &&
      ((role !== "Checker" &&
        (!team || team.includes(socketData?.task?.assigned_to?.id))) ||
        role === "Checker") &&
      (!status || status.includes(socketData.task.status))
    ) {
      setCharacters((prev: TTask[] | undefined) => {
        if (prev && prev?.length >= 15) {
          prev?.pop();
        }
        if (socketData.type === "task_create") {
          return [socketData.task, ...(prev || [])];
        } else if (socketData.type === "task_update") {
          if (role !== "Checker") {
            const updatedData =
              prev?.filter((b: TTask) => b.id !== socketData.task.id) || [];
            const data: TTask[] = [socketData.task, ...updatedData];
            data.sort((a: TTask, b: TTask) => {
              if (a.status === "New" && b.status === "New") {
                return 0;
              }
              if (a.status === "New") {
                return -1;
              }
              if (b.status === "New") {
                return 1;
              }
              return 0;
            });
            return data;
          } else {
            const data = (prev || []).map((b: TTask) =>
              b.id === socketData.task.id ? socketData.task : b
            );
            return data;
          }
        } else if (socketData.type === "task_delete") {
          const data = (prev || []).filter(
            (b: TTask) => b.id !== socketData.task.id
          );
          return data;
        } else if (socketData.type === "task_forward") {
          if (role === "Checker") {
            if (socketData.task.assigned_to.id === team_id) {
              return [socketData.task, ...(prev || [])];
            } else {
              const data = (prev || []).filter(
                (b: TTask) => b.id !== socketData.task.id
              );
              return data;
            }
          } else {
            const updatedData =
              prev?.filter((b: TTask) => b.id !== socketData.task.id) || [];
            const data: TTask[] = [socketData.task, ...updatedData];
            data.sort((a: TTask, b: TTask) => {
              if (a.status === "New" && b.status === "New") {
                return 0;
              }
              if (a.status === "New") {
                return -1;
              }
              if (b.status === "New") {
                return 1;
              }
              return 0;
            });
            return data;
          }
        } else if (socketData.type === "callback_request") {
          if (socketData?.callback_request) {
            console.log("run");

            openNotification("bottomRight", socketData?.callback_request);
          }
        }
        return prev;
      });
    }
  }, [socketData, openNotification]);

  const teamData = useTeamData("");

  const teamOptions: { label: string; value: any }[] | undefined =
    teamData?.data?.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));

  const { data, isLoading, refetch } = useTasks({
    search,
    status,
    team,
    page,
  });
  useEffect(() => {
    if (data) {
      setCharacters(data?.data);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [search, status, team]);

  const showModal = () => {
    setOpen(true);
  };
  const [recordTask, setRecordTask] = useState<TTask>();
  const showTaskModal = (e: TTask) => {
    setRecordTask(e);
    setModalOpen(true);
  };

  const Next = () => {
    const a = Number(page) + 1;
    setPage(a);
  };
  const Previos = () => {
    Number(page);
    if (page > 1) {
      const a = Number(page) - 1;
      setPage(a);
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const searchText = e.target.value;
    timerRef.current = setTimeout(() => {
      setSearch(searchText);
    }, 1000);
  };
  const theme = localStorage.getItem("theme") === "true" ? true : false;
  return (
    <div>
      {contextHolder}
      {open && <AddTask open={open} setOpen={setOpen} />}
      {uploadOpen && (
        <TaskUploadModal
          refetch={refetch}
          recordTask={recordTask}
          uploadOpen={uploadOpen}
          setUploadOpen={setUploadOpen}
        />
      )}
      {modalOpen && (
        <TaskModal
          uploadOpen={uploadOpen}
          setUploadOpen={setUploadOpen}
          recordTask={recordTask}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          refetch={refetch}
        />
      )}
      <div className="header d-flex">
        <div className="header-title d-flex">
          <p className="title">Tasks</p>
          {isLive ? (
            <div className="d-flex" style={{ marginRight: 15 }}>
              <div className="circle"></div>
              <p className={!theme ? "live-p" : "live-p-dark"}>online</p>
            </div>
          ) : (
            <div className="d-flex" style={{ marginRight: 15 }}>
              <div className="circle2"></div>
              <p className="live-p">offline</p>
            </div>
          )}
        </div>
        <div className="d-flex">
          {role !== "Checker" && (
            <button className="btn-add d-flex" onClick={showModal}>
              <img style={{ marginRight: 8 }} src={addicon} alt="" />
              Add Task
            </button>
          )}
          <button
            className={`btn-refresh-${theme && "dark"} d-flex`}
            onClick={() => {
              refetch();
              connect();
            }}
          >
            <img style={{ marginRight: 8 }} src={refreshicon} alt="" />
            Refresh
          </button>
        </div>
      </div>
      <div className="filter d-flex">
        <div className="search-div">
          <img src={IconSearch} alt="" />
          <input
            className={`search-input-${theme}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
        <Select
          style={{ width: 260, marginLeft: 12 }}
          placeholder="status"
          onChange={(value: any) => setStatus(value)}
          mode="multiple"
        >
          <Option value="New">New</Option>
          <Option value="Checking">Checking</Option>
          <Option value="Done">Done</Option>
        </Select>
        {role !== "Checker" && (
          <Select
            mode="multiple"
            style={{ width: 260, marginLeft: 12 }}
            placeholder="team"
            onChange={(value: any) => setTeam(value)}
            options={teamOptions}
          />
        )}
      </div>
      <TaskTable
        data={{ characters }}
        isLoading={isLoading}
        showTaskModal={showTaskModal}
      />
      <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
        <Space style={{ width: "100%", justifyContent: "flex-end" }} wrap>
          <Button
            type="primary"
            icon={<StepBackwardOutlined />}
            onClick={Previos}
          ></Button>
          <Input
            style={{ width: 50, textAlign: "right" }}
            value={page}
            onChange={(e) => {
              let num = e.target.value;
              if (Number(num) && num !== "0") {
                setPage(num);
              }
            }}
          />
          <Button
            type="primary"
            icon={<StepForwardOutlined />}
            onClick={Next}
          ></Button>
        </Space>
      </Space>
    </div>
  );
};

export default Task;
