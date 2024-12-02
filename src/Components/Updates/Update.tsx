import { useState } from "react";
import AddUpdate from "./AddUpdate";
import { Select, Typography } from "antd";
import UpdateTable from "./UpdateTable";
import { useUpdateData } from "../../Hooks/Update";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
//@ts-ignore
import refreshicon from "../../assets/refreshIcon.png";
const Update = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>([
    "New",
    "In Progress",
    "Paper",
    "Setup",
  ]);
  const { Option } = Select;

  const { data, refetch, isLoading } = useUpdateData(status);

  const showModal = () => {
    setOpen(true);
  };
  const theme = localStorage.getItem("theme") === "true" ? true : false;
  return (
    <div>
      {open && <AddUpdate refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex" style={{ marginBottom: 16 }}>
        <Typography className="title">Updates</Typography>
        <div className="d-flex">
          <button className="btn-add d-flex" onClick={showModal}>
            <img style={{ marginRight: 8 }} src={addicon} alt="" />
            Add
          </button>
          <button
            className={`btn-refresh-${false && "dark"} d-flex`}
            onClick={() => {
              refetch();
            }}
          >
            <img style={{ marginRight: 8 }} src={refreshicon} alt="" />
            Refresh
          </button>
        </div>
      </div>
      <div className="filter d-flex">
        <Select
          style={{ width: 260, marginLeft: 10 }}
          placeholder="status"
          onChange={(value: any) => setStatus(value)}
          mode="multiple"
          defaultValue={[]}
        >
          <Option value="New">New</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
          <Option value="Paper">Paper</Option>
          <Option value="Setup">Setup</Option>
        </Select>
      </div>
      <UpdateTable data={data} refetch={refetch} isLoading={isLoading} />
    </div>
  );
};

export default Update;
