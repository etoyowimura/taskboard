import { useEffect, useRef, useState } from "react";
import AddTask from "./AddTask";
import { Button, Input, Pagination, Select, Space, Typography } from "antd";
import TaskTable from "./TaskTable";
import { useTeamData } from "../../Hooks/Teams";
import { useTasks } from "../../Hooks/Tasks";
import { TTask } from "../../types/Tasks/TTasks";
import { isMobile, role, team_id } from "../../App";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
//@ts-ignore
import refreshicon from "../../assets/refreshIcon.png";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
import TaskModal from "./TaskModal";
import TaskUploadModal from "./TaskUploadModal";
import { TSocket } from "../../types/common/TSocket";
import ErrorUncompletedTasksModal from "./ErrorUncompletedTasksModal";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { theme } from "antd";

const { Option } = Select;
const Task = ({
  socketData,
  connect,
  isLive,
}: {
  socketData: TSocket | undefined;
  connect: () => Promise<void>;
  isLive: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [characters, setCharacters] = useState<TTask[] | undefined>();
  const [team, setTeam] = useState<any>();
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<any>();
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [uncomletedData, setUncomletedData] = useState<TTask[]>();

  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (
      socketData &&
      socketData.task &&
      ((role !== "Checker" &&
        (!team || team.includes(socketData?.task?.assigned_to?.id))) ||
        role === "Checker")
      // &&(!status || status.includes(socketData?.task?.status))
    ) {
      setCharacters((prev: any) => {
        if (prev && prev?.length >= 15) {
          prev?.pop();
        }
        if (socketData.type === "task_create" && socketData.task) {
          return [socketData.task, ...(prev || [])];
        } else if (socketData.type === "task_update") {
          if (role !== "Checker") {
            const updatedData =
              prev?.filter((b: TTask) => b.id !== socketData?.task?.id) || [];
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
              b.id === socketData.task?.id ? socketData.task : b
            );
            return data;
          }
        } else if (socketData.type === "task_delete") {
          const data = (prev || []).filter(
            (b: TTask) => b.id !== socketData.task?.id
          );
          return data;
        } else if (socketData.type === "task_forward") {
          if (role === "Checker") {
            if (socketData.task?.assigned_to.id === team_id) {
              return [socketData.task, ...(prev || [])];
            } else {
              const data = (prev || []).filter(
                (b: TTask) => b.id !== socketData.task?.id
              );
              return data;
            }
          } else {
            const updatedData =
              prev?.filter((b: TTask) => b.id !== socketData.task?.id) || [];
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
        }
        return prev;
      });
    }
  }, [socketData]);

  const teamData = useTeamData({});

  const teamOptions: { label: string; value: any }[] | undefined =
    teamData?.data?.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));
  const page_size = 10;
  const { data, isLoading, refetch } = useTasks({
    search,
    status,
    team,
    page,
    page_size: 10,
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
  const showErrorModal = (e: { data: TTask[]; status: number }) => {
    setUncomletedData(e?.data);

    setErrorModal(true);
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

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
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
  const themes = localStorage.getItem("theme") === "true" ? true : false;

  const { token } = theme.useToken();

  return (
    <div>
      {open && <AddTask open={open} setOpen={setOpen} />}
      {uploadOpen && (
        <TaskUploadModal
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
          setRecordTask={setRecordTask}
          modalOpen={modalOpen}
          socketData={socketData}
          setModalOpen={setModalOpen}
        />
      )}
      {errorModal && (
        <ErrorUncompletedTasksModal
          errorModal={errorModal}
          setErrorModal={setErrorModal}
          uncomletedData={uncomletedData}
        />
      )}
      <div className="header d-flex">
        <div className="header-title d-flex">
          <Typography className="title">Tasks</Typography>
        </div>
        <div className="d-flex">
          {role !== "Checker" && (
            <button className="btn-add d-flex" onClick={showModal}>
              <img
                style={{ marginRight: isMobile ? "0px" : "8px" }}
                src={addicon}
                alt=""
              />
              {!isMobile && "Add Task"}
            </button>
          )}
          <button
            className={`btn-refresh-${false && "dark"} d-flex`}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
            }}
            onClick={() => {
              refetch();
              if (!isLive) {
                connect();
              }
            }}
          >
            <img
              style={{ marginRight: isMobile ? "-8px" : "8px" }}
              src={refreshicon}
              alt=""
            />
            {!isMobile && "Refetch"}
          </button>
        </div>
      </div>
      <div className={`filter ${isMobile ? "mobile-filter" : "d-flex"}`}>
        <div className="search-div">
          <img src={IconSearch} alt="" />
          <input
            className={`search-input-${themes}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
        <Select
          style={{
            width: 260,
            marginLeft: 12,
            marginTop: isMobile ? 10 : 0,
            marginBottom: isMobile ? 10 : 0,
          }}
          placeholder="Status"
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
            placeholder="Team"
            onChange={(value: any) => setTeam(value)}
            options={teamOptions}
          />
        )}
      </div>
      <TaskTable
        data={{ characters }}
        isLoading={isLoading}
        showTaskModal={showTaskModal}
        showErrorModal={showErrorModal}
        setErrorModal={setErrorModal}
      />
      <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
        <Space
          style={{
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: token.colorBgContainer,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            padding: "10px 0",
            zIndex: 1000,
          }}
          wrap
        >
          <Button
            onClick={Previos}
            disabled={data?.previous ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <LeftOutlined />
          </Button>

          <Input
            disabled
            style={{
              width: 40,
              textAlign: "center",
              background: token.colorBgContainer,
              border: "1px solid",
              borderColor: token.colorText,
              color: token.colorText,
            }}
            value={page}
            onChange={(e) => {
              let num = e.target.value;
              if (Number(num) && num !== "0") {
                setPage(Number(num));
              }
            }}
          />

          <Button
            onClick={Next}
            disabled={data?.next ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <RightOutlined />
          </Button>
          {/* <Pagination
            current={page}
            total={data?.data.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          /> */}
        </Space>
      </Space>
    </div>
  );
};

export default Task;
