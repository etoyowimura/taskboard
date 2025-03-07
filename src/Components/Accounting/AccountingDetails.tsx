import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Typography from "antd/es/typography/Typography";
import { DatePicker, DatePickerProps, Table } from "antd";
import tagIcon from "../../assets/tagIcon.svg";
import dayjs from "dayjs";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

interface Salary {
  id: number;
  month: string;
  year: number;
  number_of_tasks: number;
  total_points: number;
  salary_type: string;
  base_salary: number;
  performance_salary: number;
  total_salary: number;
}

interface Data {
  user: User;
  salaries: Salary[];
  total: number;
}

const AccountingDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const now = dayjs();
  const moment = require("moment");
  const currentDate = moment();
  // const defaultDate = `${currentDate.format("YYYY")}`;

  const disabledDate = (current: any) => {
    return current && current.year() > moment().year();
  };

  const [date, setDate] = useState<string | null>(null);

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    if (!date) {
      setDate("");
    } else {
      const year = date.format("YYYY");
      setDate(year);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const API_URL = `https://api.tteld.co/api/v1/user-salaries/${id}`;
      const AUTH_TOKEN = localStorage.getItem("access");

      try {
        const response = await axios.get(API_URL, {
          params: {
            user_id: id,
            year: date,
          },
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          maxRedirects: 0,
        });

        setUser(response.data);

        setLoading(false);
      } catch (error: any) {
        console.error("Error:", error.response?.status, error.response?.data);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [date]);

  return (
    <>
      <div
        className="header d-flex  statistics-header"
        style={{ marginBottom: 16 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {user?.user.first_name && user.user.last_name ? (
            <Typography className="title">
              {user?.user.first_name} {user?.user.last_name}
            </Typography>
          ) : (
            <Typography className="title">{user?.user.username}</Typography>
          )}
          <Typography style={{ fontSize: 18, fontWeight: 700, marginTop: 24 }}>
            Total: ${user?.total}
          </Typography>
        </div>
        <div>
          <DatePicker
            onChange={onChangeDate}
            picker="year"
            format={"YYYY"}
            disabledDate={disabledDate}
            // defaultValue={now}
            style={{ marginRight: 10, width: 120, marginBottom: 10 }}
          />
        </div>
      </div>
      <Table
        size="small"
        loading={loading}
        dataSource={user?.salaries?.map((u, i) => ({
          no: i + 1,
          ...u,
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            key: "no",
            width: "5%",
          },
          {
            title: "Salary",
            dataIndex: "total_salary",
            render(value, record, index) {
              return <p>${record?.total_salary}</p>;
            },
          },
          {
            title: "Salary Type",
            dataIndex: "salary_type",
            render: (value: any, record: any) => {
              if (record.salary_type === "task_based") {
                return <p>Task Based</p>;
              } else if (record.salary_type === "hybrid") {
                return <p>Hybrid</p>;
              } else {
                return <p>{record.salary_type}</p>; // Agar boshqa qiymat bo'lsa, oddiy qilib chiqariladi
              }
            },
          },
          {
            title: "Base Salary",
            dataIndex: "base_salary",
            render(value, record, index) {
              return <p>${record?.base_salary}</p>;
            },
          },
          {
            title: "Performance Salary",
            dataIndex: "performance_salary",
            render(value, record, index) {
              return <p>${record?.performance_salary}</p>;
            },
          },
          {
            title: "Month",
            dataIndex: "month",
          },
          {
            title: "Year",
            dataIndex: "year",
          },
        ]}
        bordered
        pagination={false}
      />
    </>
  );
};

export default AccountingDetails;
