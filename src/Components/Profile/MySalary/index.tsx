import React, { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import { useMySalaryData } from "../../../Hooks/Profile";

import CurrentMonthCard from "./CurrentMonthCard";
import TotalStatistics from "./TotalStatistics";
import SalaryHistoryTable from "./SalaryHistoryTable";
import { SalaryHistory } from "../../../types/Profile/TProfile";

const { Title } = Typography;

const MySalary: React.FC = () => {
  const { data, isLoading } = useMySalaryData();

  const [years, setYears] = useState<number[]>([]);

  const extractYears = (history: SalaryHistory[]): number[] => {
    return Array.from(new Set(history.map((s) => s.year))).sort(
      (a, b) => b - a
    );
  };
  useEffect(() => {
    if (data?.salary_history && data.salary_history.length > 0) {
      setYears(extractYears(data.salary_history));
    }
  }, [data?.salary_history]);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  if (!data)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <p>No data</p>
      </div>
    );

  return (
    <div className="profile-my-salary">
      <div>
        <Title
          level={3}
          style={{
            fontFamily: "Inter",
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "-0.36px",
          }}
        >
          Current Month
        </Title>

        <CurrentMonthCard current={data.current_month} />
      </div>

      <div>
        <Title
          level={3}
          style={{
            fontFamily: "Inter",
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "-0.36px",
          }}
        >
          Total
        </Title>

        <TotalStatistics total={data.total} />
      </div>

      <div>
        {years.map((year) => (
          <SalaryHistoryTable
            key={year}
            year={year}
            salaries={data.salary_history.filter((s) => s.year === year)}
          />
        ))}
      </div>
    </div>
  );
};

export default MySalary;
