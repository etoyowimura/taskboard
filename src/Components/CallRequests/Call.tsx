import React, { useState } from "react";
import CallTable from "./CallTable";
import { useCallData } from "../../Hooks/CallRequests";
import { Radio, RadioChangeEvent } from "antd";

const Call = () => {
  const [status, setStatus] = useState("Awaiting");
  const { data, isLoading, refetch } = useCallData({ status: status });

  return (
    <div>
      <div>
        <div className="header d-flex">
          <p className="title">Call Requests</p>
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
      <CallTable data={data} isLoading={isLoading} refetch={refetch} />
    </div>
  );
};

export default Call;
