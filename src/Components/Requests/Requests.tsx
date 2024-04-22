import { useRef, useState } from "react";
import { useRequestsData } from "../../Hooks/Requests";
import RequestsTable from "./RequestsTable";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
import { Radio, RadioChangeEvent } from "antd";
import RequestsEdit from "./RequestsEdit";
import { TRequests } from "../../types/Requests/TRequests";

const Requests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Pending");
  const [modalOpen, setModalOpen] = useState(false);
  const [requestData, setRequestData] = useState<TRequests>();

  const { data, refetch, isLoading } = useRequestsData({
    search: search,
    status: status,
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
      {modalOpen && (
        <RequestsEdit
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          requestData={requestData}
        />
      )}
      <div className="header d-flex">
        <p className="title">Requests</p>
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
        <Radio.Group
          onChange={(e: RadioChangeEvent) => setStatus(e.target.value)}
          size="middle"
          value={status}
          style={{ marginLeft: 20 }}
        >
          <Radio.Button value={"Pending"}>Pending</Radio.Button>
          <Radio.Button value={"Assigned"}>Assigned</Radio.Button>
          <Radio.Button value={"Rejected"}>Rejected</Radio.Button>
          <Radio.Button value={undefined}>All</Radio.Button>
        </Radio.Group>
      </div>
      <RequestsTable
        data={data}
        isLoading={isLoading}
        refetch={refetch}
        setOpenModal={setModalOpen}
        setRequestData={setRequestData}
      />
    </div>
  );
};

export default Requests;
