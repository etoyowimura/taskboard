import { useState } from "react";
import { useServiceData } from "../../Hooks/Services";
import AddService from "./AddService";
import ServiceTable from "./ServiceTable";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
import { role } from "../../App";

const Service = () => {
  const { data, isLoading, refetch } = useServiceData();
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  return (
    <div>
      {open && <AddService refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex">
        <p className="title">Services</p>
        {role !== "Checker" && (
          <button onClick={showModal} className="btn-add d-flex">
            <img src={addicon} style={{ marginRight: 8 }} alt="" />
            Add Service
          </button>
        )}
      </div>
      <ServiceTable data={data} isLoading={isLoading} refetch={refetch} />
    </div>
  );
};

export default Service;
