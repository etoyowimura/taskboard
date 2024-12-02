import { useEffect, useState } from "react";
import CallTable from "./CallTable";
import { useCallData } from "../../Hooks/CallRequests";
import {
  Button,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  Typography,
} from "antd";
import { TCall } from "../../types/CallRequests/TCall";
import { TSocket } from "../../types/common/TSocket";

const Call = ({ socketData }: { socketData: TSocket | undefined }) => {
  const [status, setStatus] = useState("Awaiting");
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<TCall[]>();
  const { data, isLoading, refetch } = useCallData({
    status: status,
    page: page,
    page_size: 10,
  });

  const theme = localStorage.getItem("theme") === "true" ? true : false;

  useEffect(() => {
    setTableData(data?.data);
  }, [data]);
  useEffect(() => {
    let dataStatus = socketData?.callback_request?.status;
    if (socketData?.type === "callback_request") {
      if (status === "Awaiting") {
        setTableData((prev) => {
          if (prev && prev.length >= 15) {
            prev.pop();
          }
          if (dataStatus === "Resolved") {
            const data = (prev || []).filter(
              (b: TCall) => b?.id !== socketData?.callback_request?.id
            );
            return data;
          }
          if (dataStatus === "Awaiting") {
            return [socketData?.callback_request, ...(prev || [])] as TCall[];
          }
          return prev;
        });
      } else if (status === "Resolved") {
        setTableData((prev) => {
          if (prev && prev.length >= 15) {
            prev.pop();
          }
          if (dataStatus === "Awaiting") {
            const data = (prev || []).filter(
              (b: TCall) => b?.id !== socketData?.callback_request?.id
            );
            return data;
          }
          if (dataStatus === "Resolved") {
            return [socketData?.callback_request, ...(prev || [])] as TCall[];
          }
          return prev;
        });
      }
    }
  }, [socketData]);

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

  return (
    <div>
      <div>
        <div className="header d-flex">
          <Typography className="title">Call Requests</Typography>
        </div>
        <div className="filter d-flex">
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setStatus(e.target.value)}
            size="middle"
            value={status}
            style={{ marginLeft: 20 }}
          >
            <Radio.Button value={"Awaiting"}>Awaiting</Radio.Button>
            <Radio.Button value={"Resolved"}>Resolved</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <CallTable data={tableData} isLoading={isLoading} refetch={refetch} />

      {/* <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
        <Space style={{ width: "100%", justifyContent: "flex-end" }} wrap>
          <Button onClick={Previos} disabled={data?.previous ? false : true}>
            <img src={leftPagination} />
          </Button>
          <Input
            style={{ width: 30, textAlign: "center" }}
            value={page}
            onChange={(e) => {
              let num = e.target.value;
              if (Number(num) && num !== "0") {
                setPage(Number(num));
              }
            }}
          />
          <Button onClick={Next} disabled={data?.next ? false : true}>
            <img src={rightPagination} />
          </Button>
        </Space>
      </Space> */}
    </div>
  );
};

export default Call;
