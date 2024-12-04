import { useState } from "react";
import { useServiceData } from "../../Hooks/Services";
import AddService from "./AddService";
import ServiceTable from "./ServiceTable";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
import { role } from "../../App";
import { Pagination, Space, Typography } from "antd";
import { theme } from "antd";

const Service = () => {
  const [page, setPage] = useState(1);

  const { token } = theme.useToken();

  const page_size = 10;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const { data, isLoading, refetch } = useServiceData();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  return (
    <div>
      {open && <AddService refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex" style={{ marginBottom: "10px" }}>
        <Typography className="title">Services</Typography>
        {role !== "Checker" && (
          <button onClick={showModal} className="btn-add d-flex">
            <img src={addicon} style={{ marginRight: 8 }} alt="" />
            Add Service
          </button>
        )}
      </div>
      <ServiceTable data={data} isLoading={isLoading} refetch={refetch} />

      {/* <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
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
          <Button onClick={Previos} disabled={data?.previous ? false : true}>
            ＜
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
            ＞
          </Button>
          <Pagination
          // current={page}
          // total={10}
          // pageSize={2}
          // onChange={handlePageChange}
          />
        </Space>
      </Space> */}
    </div>
  );
};

export default Service;
