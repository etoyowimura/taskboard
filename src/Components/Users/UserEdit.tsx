import { useParams } from "react-router-dom";
import { useUserOne } from "../../Hooks/Users";
import {
  Form,
  Spin,
  Watermark,
  Space,
  Tabs,
  Row,
  Col,
  Input,
  Button,
  Select,
} from "antd";
import { userController } from "../../API/LayoutApi/users";
// @ts-ignore
import infoIcon from "../../assets/infoIcon.png";
// @ts-ignore
import infoIconActive from "../../assets/infoIconActive.png";
import Notfound from "../../Utils/Notfound";
import { useTeamData } from "../../Hooks/Teams";
import { useRoleData } from "../../Hooks/Role";
import { role } from "../../App";
import { useEffect, useState } from "react";
import { DollarOutlined } from "@ant-design/icons";

const TabPane = Tabs.TabPane;
type params = {
  readonly id: string;
};

const UserEdit = () => {
  const { id } = useParams<params>();
  const { Option } = Select;

  const { data, refetch, status } = useUserOne(id);
  const initialUsername = data?.username;
  const roleData = useRoleData();

  const techSupport = roleData.data?.find(
    (item) => item.name === "Tech Support"
  );

  const onSubmit = async (value: any) => {
    if (initialUsername === value.username) {
      value.username = undefined;
    }
    if (value.role_id === techSupport?.id) {
      value.team_id = null;

      id && (await userController.userPatch(value, id));
    } else {
      id && (await userController.userPatch(value, id));
    }

    if (!value.salary_type) {
      console.error("Salary type tanlanmagan!");
      return;
    }

    refetch();
    document.location.replace("/#/users/");
  };
  const TeamData = useTeamData({});
  const noTeamOption = { label: " - - - - - -", value: "" };
  const TeamOption: { label: string; value: any }[] | undefined =
    TeamData?.data?.map((item: any) => ({
      label: item?.name,
      value: item?.id,
    }));
  if (TeamOption) {
    TeamOption.unshift(noTeamOption);
  }

  const ClickDelete = () => {
    const shouldDelete = window.confirm(
      "Вы уверены, что хотите удалить этот админ?"
    );
    if (shouldDelete && id !== undefined) {
      userController.deleteUserController(id).then(() => {
        document.location.replace(`/#/users`);
      });
    }
  };
  const [activeTab, setActiveTab] = useState("1");

  const [showInput, setShowInput] = useState(false);

  const handleChange = (value: string) => {
    if (data?.role.name !== "Accountant") {
      setShowInput(true);
    }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    if (
      (data?.role.name !== "Accountant" && data?.salary_type === "hybrid") ||
      data?.salary_type === "fixed"
    ) {
      setShowInput(true);
    } else if (data?.role.name === "Accountant") {
      setShowInput(false);
    }
  }, [data]);

  return (
    <div>
      <Spin size="large" spinning={!data}>
        <Watermark style={{ height: "100%" }}>
          {status === "loading" ? (
            <Spin size="large" spinning={!data} />
          ) : data ? (
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Tabs
                defaultActiveKey="1"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
              >
                <TabPane
                  tab={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{ marginRight: 10 }}
                        src={activeTab === "1" ? infoIconActive : infoIcon}
                        alt=""
                      />
                      Information
                    </span>
                  }
                  key="1"
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ display: "flex" }}
                  >
                    <Form
                      form={form}
                      name="basic"
                      layout="vertical"
                      wrapperCol={{ span: 16 }}
                      initialValues={{ ...data }}
                      onFinish={onSubmit}
                      autoComplete="off"
                    >
                      <Row gutter={[16, 10]}>
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="First name"
                            name="first_name"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Last name"
                            name="last_name"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Username"
                            name="username"
                          >
                            <Input readOnly />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Team"
                            name="team_id"
                          >
                            <Select
                              options={TeamOption}
                              defaultValue={data?.team?.name}
                            />
                          </Form.Item>
                        </Col>
                        {role === "Owner" && (
                          <Col span={4}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Role"
                              name="role_id"
                            >
                              <Select
                                options={roleData?.data?.map((item) => ({
                                  label: item?.name,
                                  value: item?.id,
                                }))}
                                defaultValue={data?.role?.name}
                              />
                            </Form.Item>
                          </Col>
                        )}

                        {data?.role?.name !== "Accountant" &&
                          form.getFieldsValue().role_id !== 3 && (
                            <Col span={4}>
                              <Form.Item
                                wrapperCol={{ span: "100%" }}
                                label="Salary type"
                                name="salary_type"
                              >
                                <Select
                                  onChange={handleChange}
                                  placeholder="Select salary type"
                                >
                                  <Option value="task_based">Task based</Option>
                                  <Option value="hybrid">Hybrid</Option>
                                  <Option value="fixed">Fixed</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          )}
                        {showInput && (
                          <Form.Item
                            wrapperCol={{ span: "100%" }}
                            label="Fixed Amount"
                            name="salary_base_amount"
                          >
                            <Input prefix={<DollarOutlined />} />
                          </Form.Item>
                        )}
                      </Row>
                      <Form.Item>
                        {role !== "Checker" && (
                          <Button
                            onClick={() => ClickDelete()}
                            type="primary"
                            style={{ marginRight: 10 }}
                            danger
                          >
                            Delete
                          </Button>
                        )}
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </Space>
                </TabPane>
              </Tabs>
            </Space>
          ) : (
            <Notfound />
          )}
        </Watermark>
      </Spin>
    </div>
  );
};

export default UserEdit;
