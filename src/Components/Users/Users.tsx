import { useRef, useState } from "react";
import { useUserData } from "../../Hooks/Users";
import AddUser from "./AddUser";
import UserTable from "./UserTable";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
import { Pagination, Space, Typography } from "antd";

const User = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const showModal = () => {
    setOpen(true);
  };

  const { data, refetch, isLoading } = useUserData({
    name: search,
    team: "",
  });
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
      {open && <AddUser open={open} setOpen={setOpen} refetch={refetch} />}
      <div className="header d-flex">
        <Typography className="title">Users</Typography>
        <button
          className="btn-add d-flex"
          style={{ marginRight: 0 }}
          onClick={showModal}
        >
          <img src={addicon} style={{ marginRight: 8 }} alt="" />
          Invite User
        </button>
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
      </div>
      <UserTable data={data} isLoading={isLoading} refetch={refetch} />

      {/* <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
        <Space
          style={{
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            // backgroundColor: token.colorBgContainer,
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
          // total={}
          // pageSize={page_size}
          // onChange={handlePageChange}
          />
        </Space>
      </Space> */}
    </div>
  );
};

export default User;
