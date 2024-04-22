import { useRef, useState } from "react";
import AddCompany from "./AddCompanies";
import CompanyTable from "./CompaniesTable";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";

import { useCompanyData } from "../../Hooks/Companies";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
const theme = localStorage.getItem("theme") === "true" ? true : false;

const Company = () => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const [search, setSearch] = useState<any>("");
  const { data, isLoading, refetch } = useCompanyData({
    name: search,
    is_active: undefined,
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

  return (
    <div>
      {open && <AddCompany open={open} refetch={refetch} setOpen={setOpen} />}
      <div className="header d-flex">
        <h1 className="title">Companies</h1>
        <button
          style={{ marginRight: 0 }}
          className="btn-add d-flex"
          onClick={showModal}
        >
          <img src={addicon} style={{ marginRight: 8 }} alt="" />
          Add Company
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

      <CompanyTable data={data} isLoading={isLoading} />
    </div>
  );
};

export default Company;
