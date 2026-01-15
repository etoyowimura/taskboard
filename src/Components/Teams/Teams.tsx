import { Tabs, Typography } from "antd";
import TeamServices from "./TeamServices/TeamServices";
import TeamMonitoring from "./TeamMonitoring/TeamMonitoring";

const Teams = () => {
  const items = [
    {
      key: "services",
      label: "Service Team",
      children: <TeamServices />,
    },
    {
      key: "monitoring",
      label: "Monitoring Team",
      children: <TeamMonitoring />,
    },
  ];

  return (
    <div>
      <div
        className="header d-flex  statistics-header"
        style={{ marginBottom: 16 }}
      >
        <Typography className="title">Teams</Typography>
      </div>
      <Tabs items={items} />
    </div>
  );
};

export default Teams;
