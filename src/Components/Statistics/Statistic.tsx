import { useEffect, useRef, useState } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { statController } from "../../API/LayoutApi/statistic";
import { useTeamData } from "../../Hooks/Teams/index";
import {
  useCreatorsData,
  useGeneralChartData,
  useStatTeamData,
  useStatsData,
  useTeamChartData,
} from "../../Hooks/Stats";
import {
  TGeneralChartData,
  TStatCreators,
  TStatTeam,
  TteamChartData,
} from "../../types/Statistic/TStat";
import StatTable from "./StatisticTable";
import StatTeamTable from "./StatisticTeamTable";
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Input,
  Select,
  Tabs,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import api from "../../API/api";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import generalActive from "../../assets/generalActive.svg";
import general from "../../assets/general.svg";
import checkersIcon from "../../assets/checkerIcon.svg";
import chekersIconActive from "../../assets/checkersIconActive.svg";
import teamsIcon from "../../assets/teamsIcon.svg";
import teamsIconActive from "../../assets/teamsIconActive.svg";
import techSupports from "../../assets/techsupportIcon.svg";
import techSupportsActive from "../../assets/techsupportIconActive.svg";

import axios from "axios";
import StatisticsSupportTable from "./StatisticsSupportTable";

const Stat = () => {
  const now = dayjs();
  const { RangePicker } = DatePicker;
  const moment = require("moment");
  const currentDate = moment();
  const nextMonth = currentDate.clone().add(1, "months");
  const start_date = `${currentDate.format("YYYY-MM")}-01 00:00:00`;
  const end_date = `${currentDate
    .clone()
    .endOf("month")
    .format("YYYY-MM-DD")} 23:59:59`;

  const [search, setSearch] = useState<string>("");
  const [SupportSearch, setSupportSearch] = useState<string>("");
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
      const firstDate = date.startOf("month");
      const secondDate = date?.add(1, "month").startOf("month");
      // const yearStart = Number(firstDate?.year());
      // const monthStart = Number(firstDate?.month()) + 1;
      // const yearEnd = Number(secondDate?.year());
      // const monthEnd = Number(secondDate?.month()) + 1;

      // setStartDate(`${yearStart}-${monthStart}-01 00:00:00`);
      // setEndDate(`${yearEnd}-${monthEnd}-01 00:00:00`);

      const formattedStartDate = firstDate.format("YYYY-MM-01 00:00:00");
      const formattedEndDate = secondDate
        .subtract(1, "day")
        .format("YYYY-MM-DD 23:59:59");
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

  interface TaskCreatorsType {
    data?: TStatCreators[];
    refetch: <TPageData>(
      options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<TStatCreators[], unknown>>;
    isLoading: boolean;
  }

  const CreatorsData: TaskCreatorsType = useCreatorsData({
    search: SupportSearch,
    start_date: startDate,
    end_date: endDate,
  });

  interface TeamschartDataType {
    data?: TteamChartData[];
    refetch: <TPageData>(
      options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<TteamChartData[], unknown>>;
    isLoading: boolean;
  }

  const today = dayjs().endOf("day");

  let finalEndDate = dayjs(endDate);

  if (finalEndDate.isAfter(today)) {
    finalEndDate = today;
  }
  const formattedEndDate = finalEndDate.format("YYYY-MM-DD HH:mm:ss");

  const TeamschartData: TeamschartDataType = useTeamChartData({
    start_date: startDate,
    end_date: formattedEndDate,
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

  const handleTechSupportSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const searchText = e.target.value;
    timerRef.current = setTimeout(() => {
      setSupportSearch(searchText);
    }, 1000);
  };

  const theme = localStorage.getItem("theme") === "true" ? true : false;

  const [activeTab, setActiveTab] = useState("1");

  const disabledDate = (current: any) => {
    return current && current >= moment().add(1, "month").startOf("month");
  };

  const predefinedColors = [
    "#ff2600", // Tomato
    "#FF4500", // OrangeRed
    "#FF1493", // DeepPink
    "#006800", // LimeGreen
    "#3CB371", // MediumSeaGreen
    "#00BFFF", // DeepSkyBlue
    "#FFD700", // Gold
    "#F08080", // LightCoral
    "#8A2BE2", // BlueViolet
    "#FFB6C1", // LightPink
  ];

  function updateLines(chartData: any, predefinedColors: any) {
    if (!chartData || chartData.length === 0) {
      return []; // Agar chartData mavjud bo'lmasa, bo'sh massiv qaytariladi
    }

    const keys = Object.keys(chartData[0]).filter((key) => key !== "date");

    // Har bir key uchun chiziqlar yaratish
    const newLines = keys.flatMap((key, index) => {
      const color = predefinedColors[index % predefinedColors.length]; // Ranglarni aylantirib foydalanadi

      // Har bir "key" uchun ikkita chiziq (biri number_of_tasks, ikkinchisi total_points)
      return [
        {
          key: `${key}.total_points`,
          color,
          name: `${key} points`,
          legend_name: `${key}`,
        },
      ];
    });

    return newLines;
  }

  const lines = TeamschartData.data
    ? updateLines(TeamschartData.data, predefinedColors)
    : [];

  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState<Record<string, any> | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = dayjs().endOf("day");

        let finalEndDate = dayjs(endDate);

        if (finalEndDate.isAfter(today)) {
          finalEndDate = today;
        }
        const formattedEndDate = finalEndDate.format("YYYY-MM-DD HH:mm:ss");

        const response = await api.get("stats/general-stats", {
          params: { start_date: startDate, end_date: formattedEndDate },
        });
        if (response.data.daily_stats) {
          setChartData(response.data.daily_stats);
        }
        if (response.data.summary) {
          setSummaryData(response.data.summary);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching daily stats:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-EN", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

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
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "1" ? generalActive : general}
                alt="icon"
              />
              General
            </span>
          }
          key="1"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "column",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {summaryData && (
                <div
                  className="card_stat"
                  style={{
                    backgroundColor: "#F99E2C",
                  }}
                >
                  <p>Total</p>
                  <span>{summaryData.total}</span>
                  <p>Tasks</p>
                </div>
              )}
              {summaryData && (
                <div
                  className="card_stat"
                  style={{
                    backgroundColor: "#27AE60",
                  }}
                >
                  <p>Active</p>
                  <span>{summaryData.total_completed}</span>
                  <p>Tasks</p>
                </div>
              )}
              {summaryData && (
                <div
                  className="card_stat"
                  style={{
                    backgroundColor: "#F64747",
                  }}
                >
                  <p>Inactive</p>
                  <span>{summaryData.total_incomplete}</span>
                  <p>Tasks</p>
                </div>
              )}
            </div>
            <ResponsiveContainer
              width="100%"
              height={517}
              style={{ textTransform: "capitalize" }}
            >
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} stroke="#D7D8E080" />
                <XAxis
                  dataKey="task_date"
                  style={{
                    color: "#9B9DAA",
                    fontSize: 10,
                    lineHeight: "12.4px",
                    fontWeight: 400,
                  }}
                  tickFormatter={formatDate}
                />
                <YAxis
                  style={{
                    color: "#9B9DAA",
                    fontSize: 10,
                    fontWeight: 400,
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="total_tasks"
                  stroke="#F99E2C"
                  name="Total Tasks"
                />
                <Line
                  dataKey="completed_tasks"
                  stroke="#27AE60"
                  name="Active tasks"
                />
                <Line
                  dataKey="incomplete_tasks"
                  stroke="#F64747"
                  name="Inactive Tasks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabPane>

        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "2" ? techSupportsActive : techSupports}
                alt="icon"
              />
              Tech Supports
            </span>
          }
          key="2"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {/* <div className="search-div">
              <img src={IconSearch} alt="" />
              <input
                className={`search-input-${theme}`}
                type="text"
                placeholder="Search"
                onChange={handleTechSupportSearchChange}
              />
            </div> */}
            <div>
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={handleTechSupportSearchChange}
              />
            </div>
          </span>
          <StatisticsSupportTable
            data={CreatorsData?.data}
            isLoading={CreatorsData?.isLoading}
            refetch={CreatorsData?.refetch}
          />
        </TabPane>

        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "3" ? chekersIconActive : checkersIcon}
                alt="icon"
              />
              Checkers
            </span>
          }
          key="3"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {/* <div className="search-div" style={{ marginRight: 12 }}>
              <img src={IconSearch} alt="" />
              <input
                className={`search-input-${theme}`}
                type="text"
                placeholder="Search"
                onChange={handleSearchChange}
              />
            </div> */}
            <div style={{ marginRight: 12 }}>
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
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
            style={{ marginTop: 10, marginBottom: 40 }}
          >
            Save as file
          </Button>
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "4" ? teamsIconActive : teamsIcon}
                alt="icon"
              />
              Teams
            </span>
          }
          key="4"
        >
          <StatTeamTable
            data={TeamData?.data}
            isLoading={TeamData?.isLoading}
            refetch={TeamData?.refetch}
          />
          <Button
            type="primary"
            onClick={(e) => handleSave("")}
            style={{ marginTop: 10 }}
          >
            Save as file
          </Button>

          <div style={{ display: "flex", alignItems: "center", marginTop: 30 }}>
            <ResponsiveContainer width="100%" height={517}>
              <LineChart
                data={TeamschartData.data || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid vertical={false} stroke="#D7D8E080" />
                <XAxis
                  dataKey="date"
                  style={{
                    color: "#9B9DAA",
                    fontSize: 12,
                    lineHeight: "15.4px",
                    fontWeight: 400,

                    letterSpacing: 0.8,
                  }}
                  tickFormatter={formatDate}
                />
                <YAxis
                  style={{
                    color: "#9B9DAA",
                    fontSize: 10,
                    fontWeight: 400,
                  }}
                />
                <Tooltip />
                <Legend
                  payload={lines.map((line) => ({
                    value: line.legend_name, // Legenddagi yozuv sifatida `name` beriladi
                    type: "line",
                    id: line.key,
                    color: line.color,
                  }))}
                />

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
            </ResponsiveContainer>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Stat;
