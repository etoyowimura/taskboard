import { useState } from "react";
import StatisticsChekers from "./StatisticsChekers";
import StatTeamTable from "./StatisticTeam";
import dayjs from "dayjs";
import { DatePicker, DatePickerProps, Tabs, TabsProps, Typography } from "antd";
import generalActive from "../../assets/generalActive.svg";
import general from "../../assets/general.svg";
import checkersIcon from "../../assets/checkerIcon.svg";
import chekersIconActive from "../../assets/checkersIconActive.svg";
import teamsIcon from "../../assets/teamsIcon.svg";
import teamsIconActive from "../../assets/teamsIconActive.svg";
import techSupports from "../../assets/techsupportIcon.svg";
import techSupportsActive from "../../assets/techsupportIconActive.svg";

import StatisticGeneral from "./StatisticGeneral";
import StatisticsTechSupport from "./StatisticsTechSupport";

const Statistic = () => {
  const now = dayjs();
  const { RangePicker } = DatePicker;
  const moment = require("moment");
  const currentDate = moment();
  const start_date = `${currentDate.format("YYYY-MM")}-01 00:00:00`;
  const end_date = `${currentDate
    .clone()
    .endOf("month")
    .format("YYYY-MM-DD")} 23:59:59`;

  const [activeTab, setActiveTab] = useState("1");
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);

  const datePick = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      setStartDate(dates[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"));
      setEndDate(dates[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"));
    }
  };

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    if (!date) {
      setStartDate("");
      setEndDate("");
    } else {
      const firstDate = date.startOf("month");
      const secondDate = date?.add(1, "month").startOf("month");

      const formattedStartDate = firstDate.format("YYYY-MM-01 00:00:00");
      const formattedEndDate = secondDate
        .subtract(1, "day")
        .format("YYYY-MM-DD 23:59:59");
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
    }
  };

  const disabledDate = (current: any) => {
    return current && current >= moment().add(1, "month").startOf("month");
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ marginRight: 5 }}
            src={activeTab === "1" ? generalActive : general}
            alt="icon"
          />
          General
        </span>
      ),
      children: <StatisticGeneral startDate={startDate} endDate={endDate} />,
    },
    {
      key: "2",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ marginRight: 5 }}
            src={activeTab === "2" ? techSupportsActive : techSupports}
            alt="icon"
          />
          Tech Supports
        </span>
      ),
      children: (
        <StatisticsTechSupport startDate={startDate} endDate={endDate} />
      ),
    },
    {
      key: "3",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ marginRight: 5 }}
            src={activeTab === "3" ? chekersIconActive : checkersIcon}
            alt="icon"
          />
          Checkers
        </span>
      ),
      children: <StatisticsChekers startDate={startDate} endDate={endDate} />,
    },
    {
      key: "4",
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ marginRight: 5 }}
            src={activeTab === "4" ? teamsIconActive : teamsIcon}
            alt="icon"
          />
          Teams
        </span>
      ),
      children: <StatTeamTable startDate={startDate} endDate={endDate} />,
    },
  ];

  return (
    <div>
      <div
        className="header d-flex  statistics-header"
        style={{ marginBottom: 16 }}
      >
        <Typography className="title">Statistics</Typography>
        <div>
          <DatePicker
            onChange={onChangeDate}
            picker="month"
            format={"MMMM"}
            disabledDate={disabledDate}
            defaultValue={now}
            style={{ marginRight: 10, width: 120, marginBottom: 10 }}
          />
          <RangePicker style={{ width: 260 }} onCalendarChange={datePick} />
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={items}
      />
    </div>
  );
};

export default Statistic;
