import { useRef, useState } from "react";
import AddCustomer from "./AddCustomer";
import CustomerTable from "./CustomersTable";
import { StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { useCustomerData } from "../../Hooks/Customers";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
// @ts-ignore
import leftPagination from "../../assets/pagination-left.png";
import rightPagination from "../../assets/right-pagination.png";
import IconSearch from "../../assets/searchIcon.png";

import { Button, Input, Space, Typography } from "antd";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const showModal = () => {
    setOpen(true);
  };

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
  const theme = localStorage.getItem("theme") === "true" ? true : false;

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
            className={`search-input-${theme}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <CustomerTable data={data?.data} isLoading={isLoading} />
      {/* <Space style={{ width: "100%", marginTop: 10 }} direction="vertical">
        <Space style={{ width: "100%", justifyContent: "flex-end" }} wrap>
          <Button onClick={Previos} disabled={!data?.previous}>
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
          <Button onClick={Next} disabled={!data?.next}>
            <img src={rightPagination} />
          </Button>
        </Space>
      </Space> */}
    </div>
  );
};

export default Customer;
