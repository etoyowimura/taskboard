import { useRef, useState } from "react";
import AddCustomer from "./AddCustomer";
import CustomerTable from "./CustomersTable";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useCustomerData } from "../../Hooks/Customers";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
// @ts-ignore

import IconSearch from "../../assets/searchIcon.png";

import { Button, Input, Pagination, Space, Typography } from "antd";
import { theme } from "antd";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const showModal = () => {
    setOpen(true);
  };

  const page_size = 10;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const { token } = theme.useToken();

  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useCustomerData({
    name: search,
    is_active: undefined,
    page_size: 10,
    page: page,
  });

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
  const themes = localStorage.getItem("theme") === "true" ? true : false;

  return (
    <div>
      {open && <AddCustomer open={open} setOpen={setOpen} />}
      <div className="header d-flex">
        <Typography className="title">Drivers</Typography>
        <button className="btn-add d-flex" onClick={showModal}>
          <img src={addicon} style={{ marginRight: 8 }} alt="" />
          Add Driver
        </button>
      </div>
      <div className="filter d-flex">
        <div className="search-div">
          <img src={IconSearch} alt="" />
          <input
            className={`search-input-${themes}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <CustomerTable data={data?.data} isLoading={isLoading} />
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
            type="primary"
            onClick={Previos}
            disabled={!data?.previous}
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
            type="primary"
            onClick={Next}
            disabled={!data?.next}
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
            total={10}
            pageSize={page_size}
            onChange={handlePageChange}
          /> */}
        </Space>
      </Space>
    </div>
  );
};

export default Customer;
