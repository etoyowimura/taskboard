import { useState } from "react";
import dayjs from "dayjs";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { TProfilePutParams, prof } from "../../API/LayoutApi/profile";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Tabs,
  Watermark,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useMystatsData, useProfData } from "../../Hooks/Profile";
import { role } from "../../App";
import ChangePassword from "./ChangePassword";
import MySalary from "./MySalary";
import MyHistory from "./HIstory";

const Profile = () => {
  const { data, refetch } = useProfData();

  const onSubmit = async (value: TProfilePutParams) => {
    await prof.profPatch(value);
    refetch();
  };

  const moment = require("moment-timezone");

  const { RangePicker } = DatePicker;
  const currentDate = moment();
  const start_date = `${currentDate.format("YYYY-MM")}-01 00:00:00`;
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const datePick = (a: any, b: any) => {
    if (b[0] && b[1]) {
      setStartDate(`${b[0]} 00:00:00`);
      setEndDate(`${b[1]} 23:59:59`);
    }
  };

  const { data: lineData } = useMystatsData({
    start_date: startDate,
    end_date: endDate,
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-EN", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const chartData = lineData?.daily_stats.map((stat: any) => ({
    date: formatDate(stat.date),
    tasks: stat.number_of_tasks,
  }));

  const firstDayOfMonth = dayjs().startOf("month");
  const today = dayjs();

  const dateFormat = "YYYY-MM-DD";

  return (
    <div>
      <Spin size="large" spinning={!data}>
        <Watermark style={{ height: "100%" }}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Tabs>
              <TabPane tab={<span>Information</span>} key="1">
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  {data !== undefined && (
                    <Form
                      name="basic"
                      layout="vertical"
                      wrapperCol={{ span: 16 }}
                      initialValues={{ ...data }}
                      autoComplete="off"
                      onFinish={onSubmit}
                    >
                      <Row gutter={[16, 10]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="First name"
                            name="first_name"
                          >
                            <Input placeholder="Enter first name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Last name"
                            name="last_name"
                          >
                            <Input placeholder="Enter last name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Username"
                            name="username"
                          >
                            <Input placeholder="Enter username" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="E-mail"
                            name="email"
                          >
                            <Input placeholder="Enter email" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                  {data !== undefined && (
                    <Form
                      name="basic"
                      layout="vertical"
                      wrapperCol={{ span: 16 }}
                      initialValues={{ ...data }}
                      autoComplete="off"
                    >
                      <Row gutter={[16, 10]}>
                        {data && data.team !== "" && (
                          <Col>
                            {role === "Owner" || role === "Tech Support" ? (
                              ""
                            ) : (
                              <Form.Item
                                wrapperCol={{ span: "100%" }}
                                label="Team"
                                name="team"
                              >
                                <Input readOnly />
                              </Form.Item>
                            )}
                          </Col>
                        )}
                      </Row>
                    </Form>
                  )}
                  <div className="">
                    <h2 style={{ marginBottom: 20 }}>My Statistics</h2>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <RangePicker
                        onCalendarChange={datePick}
                        defaultValue={[
                          dayjs(firstDayOfMonth, dateFormat),
                          dayjs(today, dateFormat),
                        ]}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "space-between",
                        gap: 15,
                        marginTop: 35,
                      }}
                    >
                      <div
                        style={{
                          width: 156,
                          height: 330,
                          display: "flex",
                          flexDirection: "column",
                          gap: 15,
                        }}
                      >
                        <div
                          className="card_stat"
                          style={{ backgroundColor: "#F99E2C" }}
                        >
                          <p>Total</p>
                          <span>{lineData?.total_for_period} </span>
                          <p>
                            {role === "Owner" || role === "Tech Support"
                              ? "Tasks"
                              : "Points"}
                          </p>
                        </div>
                        <div
                          className="card_stat"
                          style={{ backgroundColor: "#409CFF" }}
                        >
                          <p>Average</p>
                          <span>{lineData?.avg_stats_for_period} </span>
                          <p>
                            {role === "Owner" || role === "Tech Support"
                              ? "Tasks a day"
                              : "Points a day"}{" "}
                          </p>
                        </div>
                      </div>

                      <ResponsiveContainer
                        width="100%"
                        height={370}
                        style={{ textTransform: "capitalize" }}
                      >
                        <LineChart data={chartData}>
                          <CartesianGrid vertical={false} stroke="#D7D8E080" />
                          <XAxis
                            dataKey="date"
                            style={{
                              color: "#9B9DAA",
                              fontSize: 10,
                              lineHeight: "12.4px",
                              fontWeight: 400,
                            }}
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
                            dataKey="tasks"
                            stroke="#F99E2C"
                            activeDot={{ r: 7 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <div
                        style={{
                          width: 156,
                          height: 330,
                          display: "flex",
                          flexDirection: "column",
                          gap: 15,
                        }}
                      >
                        <div
                          className="card_stat"
                          style={{ backgroundColor: "#9B51E0" }}
                        >
                          <p>Contribution</p>
                          <span>{lineData?.contribution}%</span>
                          <p>
                            {" "}
                            {role === "Owner" || role === "Tech Support"
                              ? "to Business"
                              : `to ${data?.team}`}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Space>
              </TabPane>

              {(role === "Checker" || role === "Tech Support") && (
                <TabPane tab={<span>My Salary</span>} key="2">
                  <MySalary />
                </TabPane>
              )}

              {role === "Tech Support" && (
                <TabPane tab={<span>History</span>} key="3">
                  <MyHistory role={role} />
                </TabPane>
              )}
              <TabPane tab={<span>Change Password</span>} key="4">
                <ChangePassword />
              </TabPane>
            </Tabs>
          </Space>
        </Watermark>
      </Spin>
    </div>
  );
};

export default Profile;
