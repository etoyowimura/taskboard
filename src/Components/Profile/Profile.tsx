import { useState } from "react";

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
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Watermark,
} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { Link } from "react-router-dom";
import {
  useMyHistoryData,
  useMystatsData,
  useProfData,
} from "../../Hooks/Profile";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import { role } from "../../App";
import ChangePassword from "./ChangePassword";
const { Option } = Select;

const Profile = () => {
  const { data, refetch } = useProfData();
  const [range, setRange] = useState<any>(1);

  const onSubmit = async (value: TProfilePutParams) => {
    await prof.profPatch(value);
    refetch();
  };

  const moment = require("moment-timezone");
  const nowUtcPlus5 = moment.tz("Asia/Tashkent");
  const formattedTimeMinusFiveSeconds = nowUtcPlus5
    .subtract(range, "days")
    .format("YYYY-MM-DDTHH:mm:ss");

  const historyData = useMyHistoryData({
    start_date: formattedTimeMinusFiveSeconds,
  });

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
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Team"
                              name="team"
                            >
                              <Input readOnly />
                            </Form.Item>
                          </Col>
                        )}
                      </Row>
                    </Form>
                  )}
                  <div className="">
                    <h2 style={{ marginBottom: 20 }}>Your Statistics</h2>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <RangePicker onCalendarChange={datePick} />
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

              <TabPane tab={<span>History</span>} key="2">
                <Select
                  style={{ width: "20%", marginBottom: 10 }}
                  placeholder="1 day"
                  onChange={(value: any) =>
                    value ? setRange(value) : setRange("1")
                  }
                  allowClear
                >
                  <Option value="3">3 days</Option>
                  <Option value="7">a week</Option>
                  <Option value="30">a month</Option>
                </Select>
                <Table
                  dataSource={historyData?.data?.map((u, i) => ({
                    no: i + 1,
                    task: { id: u.task },
                    action: u?.action,
                    description:
                      role !== "Owner"
                        ? "You finished this task and earned another 5 points!"
                        : `You ${u?.description.slice(
                            u?.description.indexOf(" ") + 1
                          )}`,
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
                      title: "Task",
                      dataIndex: "task",
                      key: "task",
                      render: ({ id }: { id: number }) => (
                        <Link to={`/${id}`}>{id}</Link>
                      ),
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
              </TabPane>
              <TabPane tab={<span>Change Password</span>} key="3">
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
