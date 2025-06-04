import { useRef, useState } from "react";
import AddUpdate from "./AddUpdate";
import { Button, Input, Select, Space, Typography, theme } from "antd";
import {
  LeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
} from "@ant-design/icons";
import UpdateTable from "./UpdateTable";
import { useUpdateData } from "../../Hooks/Update";

const Update = () => {
  const [open, setOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectChange = (value: any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setStatus(value);
    }, 1000);
  };

  const [status, setStatus] = useState<any>([
    "New",
    "In Progress",
    "Paper",
    "Setup",
  ]);

  const { Option } = Select;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);

  const pageSizeOptions = [10, 20, 30, 40, 50];

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1); // Odatda pageSize o'zgarganda sahifani 1 ga qaytaramiz
  };

  const { data, refetch, isLoading } = useUpdateData(status, page, pageSize);

  const showModal = () => {
    setOpen(true);
  };

  const { token } = theme.useToken();

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
      {open && <AddUpdate refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex" style={{ marginBottom: 16 }}>
        <Typography className="title">Updates</Typography>
        <div className="d-flex">
          {/* <button className="btn-add d-flex" onClick={showModal}>
            <img style={{ marginRight: 8 }} src={addicon} alt="" />
            Add
          </button> */}
          <Button
            style={{
              marginRight: 10,
              backgroundColor: "#f99e2c",
              color: "white",
              padding: 18,
            }}
            className="d-flex"
            onClick={showModal}
            icon={<PlusOutlined />} // Ant-design ikonkasi
          >
            Add
          </Button>
          {/* <button
            className={`btn-refresh-${false && "dark"} d-flex`}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
            }}
            onClick={() => {
              refetch();
            }}
          >
            <img style={{ marginRight: 8 }} src={refreshicon} alt="" />
            Refresh
          </button> */}
          <Button
            className="d-flex"
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              padding: 18,
            }}
            onClick={() => {
              refetch();
            }}
            icon={<ReloadOutlined />}
          >
            Refresh
          </Button>
        </div>
      </div>
      <div className="filter d-flex">
        <Select
          style={{ width: 260, marginLeft: 10 }}
          placeholder="Status"
          onChange={handleSelectChange}
          mode="multiple"
          defaultValue={[]}
        >
          <Option value="New">New</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
          <Option value="Paper">Paper</Option>
          <Option value="Setup">Setup</Option>
        </Select>
      </div>
      <UpdateTable data={data?.data} refetch={refetch} isLoading={isLoading} />
      <Space style={{ width: "100%", marginTop: 40 }} direction="vertical">
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
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 65, marginRight: 16 }}
            options={pageSizeOptions.map((size) => ({
              label: `${size}`,
              value: size,
            }))}
          />
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
              cursor: "pointer",
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

export default Update;
