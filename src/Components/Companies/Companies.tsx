import { useRef, useState } from "react";
import AddCompany from "./AddCompanies";
import CompanyTable from "./CompaniesTable";
import { StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { useCompanyPaginated } from "../../Hooks/Companies";
import { Button, Input, Space, Typography } from "antd";
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

  const theme = localStorage.getItem("theme") === "true" ? true : false;

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
            className={`search-input-${theme}`}
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <CompanyTable data={data?.data} isLoading={isLoading} />
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

export default Company;
