import { useRef, useState } from "react";
import AddCompany from "./AddCompanies";
import CompanyTable from "./CompaniesTable";
import {
  StepForwardOutlined,
  StepBackwardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useCompanyPaginated } from "../../Hooks/Companies";
import { Button, Input, Pagination, Space, Typography } from "antd";
import { theme } from "antd";

// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";

import { role } from "../../App";

const Company = () => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, refetch } = useCompanyPaginated({
    name: search,
    is_active: undefined,
    page: page,
    page_size: 10,
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

  const page_size = 15;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const themes = localStorage.getItem("theme") === "true" ? true : false;

  return (
    <div>
      {open && <AddCompany open={open} refetch={refetch} setOpen={setOpen} />}
      <div className="header d-flex">
        <Typography className="title">Companies</Typography>
        {role !== "Checker" && (
          <button
            style={{ marginRight: 0 }}
            className="btn-add d-flex"
            onClick={showModal}
          >
            <img src={addicon} style={{ marginRight: 8 }} alt="" />
            Add Company
          </button>
        )}
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

      <CompanyTable data={data?.data} isLoading={isLoading} />
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
          {/* <Pagination
            current={page}
            total={data?.page_size}
            pageSize={page_size}
            onChange={handlePageChange}
          /> */}
        </Space>
      </Space>
    </div>
  );
};

export default Company;
