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
import { Button, DatePicker, DatePickerProps, Select, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
// @ts-ignore
import IconSearch from "../../assets/searchIcon.png";

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

  const teamData = useTeamData("");
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

  const datePick = (a: any, b: any) => {
    if (b[0] && b[1]) {
      setStartDate(`${b[0]} 00:00:00`);
      setEndDate(`${b[1]} 23:59:59`);
    }
  };

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    if (!date) {
      setStartDate("");
      setEndDate("");
    } else {
      const firstDate = date;
      const secondDate = date?.add(1, "month");
      const yearStart = Number(firstDate?.year());
      const monthStart = Number(firstDate?.month()) + 1;
      const yearEnd = Number(secondDate?.year());
      const monthEnd = Number(secondDate?.month()) + 1;

      setStartDate(`${yearStart}-${monthStart}-01 00:00:00`);
      setEndDate(`${yearEnd}-${monthEnd}-01 00:00:00`);
    }
  };

  const { data, refetch, isLoading } = useStatsData({
    search: search,
    team: team,
    start_date: startDate,
    end_date: endDate,
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
  return (
    <div>
      <div className="header d-flex" style={{ marginBottom: 16 }}>
        <p className="title">Statistics</p>
        <div className="">
          <DatePicker
            onChange={onChangeDate}
            picker="month"
            format={"MMMM"}
            defaultValue={now}
            style={{ marginRight: 10, width: 120 }}
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
              placeholder="team"
              onChange={(value: any) => setTeam(value)}
              options={teamOptions}
            />
          </span>
          <StatTable
            data={{ data: data }}
            isLoading={isLoading}
            refetch={refetch}
          />
          <Button type="primary" onClick={(e) => handleSave("team")}>
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
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Stat;
