import React, { useState, useMemo } from "react";
import { Select, Table } from "antd";
import moment from "moment-timezone";
import tagIcon from "../../../assets/tagIcon.svg";
import { useMyHistoryData } from "../../../Hooks/Profile";

const { Option } = Select;

interface MyHistoryProps {
  role: string;
}

const MyHistory: React.FC<MyHistoryProps> = ({ role }) => {
  const [range, setRange] = useState<number>(1);

  const { start_date, end_date } = useMemo(() => {
    const nowUtcPlus5 = moment.tz("Asia/Tashkent");
    const startDate = nowUtcPlus5.clone().subtract(range, "days");
    return {
      start_date: startDate.format("YYYY-MM-DDTHH:mm:ss"),
      end_date: nowUtcPlus5.format("YYYY-MM-DDTHH:mm:ss"),
    };
  }, [range]);

  const historyData = useMyHistoryData({ start_date, end_date });

  return (
    <div>
      <Select
        style={{ width: "20%", marginBottom: 10 }}
        placeholder="days"
        onChange={(value: any) => setRange(Number(value))}
        allowClear
      >
        <Option value={3}>3 days</Option>
        <Option value={7}>a week</Option>
        <Option value={30}>a month</Option>
      </Select>

      <Table
        dataSource={historyData?.data?.map((u, i) => ({
          no: i + 1,
          task: { id: u.task },
          action: u?.action,
          description:
            role !== "Owner"
              ? "You finished this task and earned another 5 points!"
              : `You ${u?.description.slice(u?.description.indexOf(" ") + 1)}`,
          timestamp: u.timestamp
            ? moment(u.timestamp).format("DD.MM.YYYY, HH:mm")
            : "",
          key: u.id,
        }))}
        columns={[
          {
            title: <img alt="" src={tagIcon} />,
            dataIndex: "no",
            key: "no",
            width: "5%",
          },
          {
            title: "Task ID",
            dataIndex: "task",
            key: "task",
            render: ({ id }: { id: number }) => <span>{id}</span>,
          },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
          },
        ]}
        scroll={{ x: "768px" }}
      />
    </div>
  );
};

export default MyHistory;
