import { useRef, useState } from "react";
import AddCustomer from "./AddCustomer";
import CustomerTable from "./CustomersTable";
import { useCustomerData } from "../../Hooks/Customers";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";

const Customer = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const [search, setSearch] = useState("");
  const { isLoading, data, refetch } = useCustomerData({
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
  const theme = localStorage.getItem("theme") === "true" ? true : false;
  return (
    <div>
      {open && <AddCustomer open={open} setOpen={setOpen} refetch={refetch} />}
      <div className="header d-flex">
        <p className="title">Drivers</p>
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
      <CustomerTable data={data} isLoading={isLoading} />
    </div>
  );
};

export default Customer;
