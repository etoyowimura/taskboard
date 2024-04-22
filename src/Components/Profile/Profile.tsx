import { useState } from "react";
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
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="First name"
                            name="first_name"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Last name"
                            name="last_name"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Username"
                            name="username"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="E-mail"
                            name="email"
                          >
                            <Input />
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
                          <Col span={6}>
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
                        width: "100%",
                        height: "70vh",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 50,
                          marginTop: 20,
                          marginLeft: 30,
                          width: "80%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p className="card_stat">
                          Average:{" "}
                          <span>{lineData?.avg_stats_for_period} </span>
                          {role === "Owner" ? "tasks" : "pts"}/day
                        </p>
                        <p className="card_stat">
                          Total: <span>{lineData?.total_for_period} </span>
                          {role === "Owner" ? "tasks" : "pts"}
                        </p>
                        <p className="card_stat">
                          Contribution: <span>{lineData?.contribution}</span>%
                        </p>
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
