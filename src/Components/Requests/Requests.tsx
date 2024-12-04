import { useEffect, useRef, useState } from "react";
import { useRequestsData } from "../../Hooks/Requests";
import {
  StepForwardOutlined,
  StepBackwardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  Typography,
  theme,
} from "antd";
import { TRequests } from "../../types/Requests/TRequests";
import { TSocket } from "../../types/common/TSocket";
import RequestsEdit from "./RequestsEdit";
import RequestsTable from "./RequestsTable";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";

const Requests = ({ socketData }: { socketData: TSocket | undefined }) => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [requestData, setRequestData] = useState<TRequests | undefined>();
  const [status, setStatus] = useState("Pending");
  const [page, setPage] = useState<number>(1);

  const { data, refetch, isLoading } = useRequestsData({
    search: search,
    status: status,
    page: page,
    page_size: 10,
  });
  const [mainData, setMainData] = useState<TRequests[]>();

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

  useEffect(() => {
    if (data) {
      setMainData(data.data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (socketData) {
  //     setMainData((prev: TRequests[] | undefined) => {
  //       if (prev && prev?.length >= 15) {
  //         prev?.pop();
  //       }
  //       if (socketData.type === "driver_request") {
  //       }
  //       return prev;
  //     });
  //   }
  // }, [socketData]);

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

  const { token } = theme.useToken();

  return (
    <div>
      {modalOpen && (
        <RequestsEdit
          refetch={refetch}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          requestData={requestData}
        />
      )}
      <div className="header d-flex">
        <Typography className="title">Requests</Typography>
      </div>
      <div className="filter d-flex requests-filter ">
        <div className="search-div">
          <img src={IconSearch} alt="" />
          <input
            className={`search-input-${themes}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
        <Radio.Group
          onChange={(e: RadioChangeEvent) => setStatus(e.target.value)}
          size="middle"
          value={status}
          className="request-radio-group"
        >
          <Radio.Button value={"Pending"}>Pending</Radio.Button>
          <Radio.Button value={"Assigned"}>Assigned</Radio.Button>
          <Radio.Button value={"Rejected"}>Rejected</Radio.Button>
        </Radio.Group>
      </div>
      <RequestsTable
        data={mainData}
        isLoading={isLoading}
        refetch={refetch}
        setOpenModal={setModalOpen}
        setRequestData={setRequestData}
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
        </Space>
      </Space>
    </div>
  );
};

export default Requests;
