import { useEffect, useState } from "react";
import { useTeamData } from "../../Hooks/Teams";
import TeamTable from "./TeamTable";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
import AddTeam from "./AddTeam";
import { Button, Input, Select, Space, Typography, theme } from "antd";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";

const Team = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem("general_pageSize");
    return saved ? Number(saved) : 15;
  });

  const { data, isLoading, refetch } = useTeamData({
    page: page,
    page_size: pageSize,
  });

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const pageSizeOptions = [15, 20, 30, 40, 50];

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  useEffect(() => {
    localStorage.setItem("general_pageSize", String(pageSize));
  }, [pageSize]);

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
      {open && <AddTeam refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex" style={{ marginBottom: 16 }}>
        <Typography className="title">Teams</Typography>
        {/* <button
          className="btn-add d-flex"
          style={{ marginRight: 0 }}
          onClick={showModal}
        >
          <img src={addicon} style={{ marginRight: 8 }} alt="" />
          Add Team
        </button> */}

        <Button
          className="btn-add d-flex"
          style={{
            backgroundColor: "#f99e2c",
            color: "white",
            padding: 18,
          }}
          onClick={showModal}
          icon={<PlusOutlined />} // Ant-design ikonkasi
        >
          Add Team
        </Button>
      </div>
      <TeamTable data={data?.data} isLoading={isLoading} refetch={refetch} />
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

export default Team;
