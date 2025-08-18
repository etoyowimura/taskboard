import dayjs from "dayjs";
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

import { useGeneralStats } from "../../Hooks/Statistics";

interface StatisticGeneralProps {
  startDate: string;
  endDate: string;
}

const StatisticGeneral: React.FC<StatisticGeneralProps> = ({
  startDate,
  endDate,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-EN", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const today = dayjs().endOf("day");
  let finalEndDate = dayjs(endDate);

  if (finalEndDate.isAfter(today)) {
    finalEndDate = today;
  }
  const formattedEndDate = finalEndDate.format("YYYY-MM-DD HH:mm:ss");

  const { data, isLoading, refetch } = useGeneralStats({
    start_date: startDate,
    end_date: formattedEndDate,
  });

  return (
    <div>
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
          {data?.summary && (
            <div
              className="card_stat"
              style={{
                backgroundColor: "#F99E2C",
              }}
            >
              <p>Total</p>
              <span>{data?.summary?.total}</span>
              <p>Tasks</p>
            </div>
          )}
          {data?.summary && (
            <div
              className="card_stat"
              style={{
                backgroundColor: "#27AE60",
              }}
            >
              <p>Active</p>
              <span>{data?.summary?.total_completed}</span>
              <p>Tasks</p>
            </div>
          )}
          {data?.summary && (
            <div
              className="card_stat"
              style={{
                backgroundColor: "#F64747",
              }}
            >
              <p>Inactive</p>
              <span>{data?.summary?.total_incomplete}</span>
              <p>Tasks</p>
            </div>
          )}
        </div>
        <ResponsiveContainer
          width="100%"
          height={517}
          style={{ textTransform: "capitalize" }}
        >
          <LineChart data={data?.daily_stats}>
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
            <Line dataKey="total_tasks" stroke="#F99E2C" name="Total Tasks" />
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
    </div>
  );
};

export default StatisticGeneral;
