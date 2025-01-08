import { useRef, useState } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { statController } from "../../API/LayoutApi/statistic";
import { useTeamData } from "../../Hooks/Teams/index";
import { useStatTeamData, useStatsData } from "../../Hooks/Stats";
import { TStatTeam } from "../../types/Statistic/TStat";
import StatTable from "./StatisticTable";
import StatTeamTable from "./StatisticTeamTable";
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Select,
  Tabs,
  Typography,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Stat = () => {
  const now = dayjs();
  const { RangePicker } = DatePicker;
  const moment = require("moment");
  const currentDate = moment();
  const nextMonth = currentDate.clone().add(1, "months");
  const start_date = `${currentDate.format("YYYY-MM")}-01 00:00:00`;
  const end_date = `${nextMonth.format("YYYY-MM")}-01 00:00:00`;

  const [search, setSearch] = useState<string>("");
  const [team, setTeam] = useState<any>("");
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);

  const [forSalary, setForSalary] = useState(true);

  const teamData = useTeamData({});
  const teamOptions: { label: string; value: any }[] | undefined =
    teamData?.data?.map((item) => ({
      label: item?.name,
      value: item?.name,
    }));
  const additionalOption = {
    label: "all",
    value: "",
  };
  if (teamOptions) {
    teamOptions.unshift(additionalOption);
  }

  const handleSave = (a: string) => {
    const trimmedStartDate = startDate.slice(0, 10);
    const trimmedEndDate = endDate.slice(0, 10);
    const fileName = `${trimmedStartDate}-${trimmedEndDate}`;
    if (a === "team") {
      const teamName = `${team}_${fileName}`;
      statController.saveUsersStats(teamName, startDate, endDate, team);
    } else {
      statController.saveTeamStats(fileName, startDate, endDate);
    }
  };

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
      const firstDate = date;
      const secondDate = date?.add(1, "month");
      // const yearStart = Number(firstDate?.year());
      // const monthStart = Number(firstDate?.month()) + 1;
      // const yearEnd = Number(secondDate?.year());
      // const monthEnd = Number(secondDate?.month()) + 1;

      // setStartDate(`${yearStart}-${monthStart}-01 00:00:00`);
      // setEndDate(`${yearEnd}-${monthEnd}-01 00:00:00`);

      const formattedStartDate = firstDate.format("YYYY-MM-DD");
      const formattedEndDate = secondDate.format("YYYY-MM-DD");
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);
      setForSalary(true);
    }
  };

  const { data, refetch, isLoading } = useStatsData({
    search: search,
    team: team,
    start_date: startDate,
    end_date: endDate,
    for_salary: forSalary,
  });
  interface DataType {
    data?: TStatTeam[];
    refetch: <TPageData>(
      options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<TStatTeam[], unknown>>;
    isLoading: boolean;
  }
  const TeamData: DataType = useStatTeamData({
    search: "",
    start_date: startDate,
    end_date: endDate,
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

  const disabledDate = (current: any) => {
    return current && current >= moment().add(1, "month").startOf("month");
  };

  // const chartData = [
  //   {
  //     date: "2024-12-01",
  //     ABM: { points: 4500, count: 20 },
  //     ZNX: { points: 2500, count: 18 },
  //     TYP: { points: 3900, count: 24 },
  //     LMO: { points: 3100, count: 16 },
  //     QWE: { points: 2800, count: 21 },
  //     RST: { points: 4400, count: 19 },
  //     UVX: { points: 3950, count: 22 },
  //     WYZ: { points: 4100, count: 20 },
  //     ERT: { points: 3700, count: 17 },
  //     KLM: { points: 4200, count: 25 },
  //     LBS: { points: 1200, count: 25 },
  //   },
  //   {
  //     date: "2024-12-02",
  //     ABM: { points: 4600, count: 21 },
  //     ZNX: { points: 2400, count: 17 },
  //     TYP: { points: 3850, count: 23 },
  //     LMO: { points: 3200, count: 15 },
  //     QWE: { points: 2750, count: 20 },
  //     RST: { points: 4450, count: 18 },
  //     UVX: { points: 4000, count: 23 },
  //     WYZ: { points: 4200, count: 19 },
  //     ERT: { points: 3750, count: 16 },
  //     KLM: { points: 4250, count: 24 },
  //     LBS: { points: 1250, count: 26 },
  //   },
  //   {
  //     date: "2024-12-03",
  //     ABM: { points: 4550, count: 19 },
  //     ZNX: { points: 2550, count: 19 },
  //     TYP: { points: 3950, count: 25 },
  //     LMO: { points: 3150, count: 17 },
  //     QWE: { points: 2850, count: 22 },
  //     RST: { points: 4500, count: 20 },
  //     UVX: { points: 3900, count: 21 },
  //     WYZ: { points: 4300, count: 21 },
  //     ERT: { points: 3800, count: 18 },
  //     KLM: { points: 4300, count: 26 },
  //     LBS: { points: 1300, count: 27 },
  //   },
  // ];

  // const lines = [
  //   { key: "ABM.points", color: "#FF5733" }, // orange-red
  //   { key: "ZNX.points", color: "#00b822" }, // lime-green
  //   { key: "TYP.points", color: "#5733FF" }, // blue-purple
  //   { key: "LMO.points", color: "#FFC300" }, // gold
  //   { key: "QWE.points", color: "#009790" }, // turquoise
  //   { key: "RST.points", color: "#FF33A1" }, // hot pink
  //   { key: "UVX.points", color: "#8D33FF" }, // violet
  //   { key: "WYZ.points", color: "#FF8D33" }, // orange
  //   { key: "ERT.points", color: "#33A1FF" }, // sky blue
  //   { key: "KLM.points", color: "#4a8a01" }, // light green
  // ];

  // console.log(chartData, );

  // const predefinedColors = ["#FF5733", "#00b822"];

  // function updateLines(chartData: any, predefinedColors: any) {
  //   const keys = Object.keys(chartData[0]).filter((key) => key !== "date");

  //   const newLines = keys.map((key, index) => {
  //     const color = predefinedColors[index % predefinedColors.length]; // Ranglarni aylantirib foydalanadi
  //     return { key: `${key}.points`, color, name: `${key}` };
  //   });

  //   return newLines;
  // }

  // lines massivini yangilash
  // const lines = updateLines(chartData, predefinedColors);

  return (
    <div>
      <div
        className="header d-flex  statistics-header "
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
            // value={datePickerValue}
            // defaultValue={dayjs().startOf("month")}
          />
          <RangePicker style={{ width: 260 }} onCalendarChange={datePick} />
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span>Users</span>} key="1">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div className="search-div" style={{ marginRight: 12 }}>
              <img src={IconSearch} alt="" />
              <input
                className={`search-input-${theme}`}
                type="text"
                placeholder="Search"
                onChange={handleSearchChange}
              />
            </div>
            <Select
              style={{ width: 260 }}
              placeholder="Team"
              onChange={(value: any) => setTeam(value)}
              options={teamOptions}
            />
          </span>
          <StatTable
            data={{ data: data }}
            isLoading={isLoading}
            refetch={refetch}
          />
          <Button
            type="primary"
            onClick={(e) => handleSave("team")}
            style={{ marginTop: 10 }}
          >
            Save as file
          </Button>
        </TabPane>
        <TabPane tab={<span>Teams</span>} key="2">
          <StatTeamTable
            data={TeamData?.data}
            isLoading={TeamData?.isLoading}
            refetch={TeamData?.refetch}
          />
          <Button type="primary" onClick={(e) => handleSave("")}>
            Save as file
          </Button>

          {/* <ResponsiveContainer width="100%" height={400}>
            <LineChart
              width={800}
              height={400}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="linear"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  activeDot={{ r: 7 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer> */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Stat;
