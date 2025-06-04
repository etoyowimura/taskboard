import { useRef, useState } from "react";
import { useUserData } from "../../Hooks/Users";
import AddUser from "./AddUser";
import UserTable from "./UserTable";
import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Select, theme } from "antd";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
import { Button, Input, Pagination, Space, Typography } from "antd";

const User = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const showModal = () => {
    setOpen(true);
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

  const { data, refetch, isLoading } = useUserData({
    name: search,
    team: "",
    page: page,
    page_size: pageSize,
  });

  const pageSizeOptions = [10, 20, 30, 40, 50];

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
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
      {open && <AddUser open={open} setOpen={setOpen} refetch={refetch} />}
      <div className="header d-flex">
        <Typography className="title">Users</Typography>
        {/* <button
          className="btn-add d-flex"
          style={{ marginRight: 0 }}
          onClick={showModal}
        >
          <img src={addicon} style={{ marginRight: 8 }} alt="" />
          Invite User
        </button> */}
        <Button
          className="d-flex"
          style={{
            backgroundColor: "#f99e2c",
            color: "white",
            padding: 18,
          }}
          onClick={showModal}
          icon={<PlusOutlined />}
        >
          Invite User
        </Button>
      </div>
      <div className="filter d-flex">
        {/* <div className="search-div">
          <img src={IconSearch} alt="" />
          <input
            className={`search-input-${themes}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div> */}
        <div>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <UserTable data={data?.data} isLoading={isLoading} refetch={refetch} />

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

export default User;
