import { useRef, useState } from "react";
import { useUserData } from "../../Hooks/Users";
import AddUser from "./AddUser";
import UserTable from "./UserTable";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";

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
        <p className="title">Users</p>
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
    </div>
  );
};

export default User;
