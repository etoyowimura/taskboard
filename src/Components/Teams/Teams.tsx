import { useEffect, useState } from "react";
import { useTeamData } from "../../Hooks/Teams";
import TeamTable from "./TeamTable";
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
import AddTeam from "./AddTeam";
import { Typography } from "antd";

const Team = () => {
  const { data, isLoading, refetch } = useTeamData({});
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };

  const theme = localStorage.getItem("theme") === "true" ? true : false;

  return (
    <div>
      {open && <AddTeam refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex" style={{ marginBottom: 16 }}>
        <Typography className="title">Teams</Typography>
        <button
          className="btn-add d-flex"
          style={{ marginRight: 0 }}
          onClick={showModal}
        >
          <img src={addicon} style={{ marginRight: 8 }} alt="" />
          Add Team
        </button>
      </div>
      <TeamTable data={data} isLoading={isLoading} refetch={refetch} />
    </div>
  );
};

export default Team;
