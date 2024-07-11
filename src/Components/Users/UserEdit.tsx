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
import { useState } from "react";
const TabPane = Tabs.TabPane;
type params = {
  readonly id: string;
};

const UserEdit = () => {
  const { id } = useParams<params>();

  const { data, refetch, status } = useUserOne(id);
  const roleData = useRoleData();
  const techSupport = roleData.data?.find(
    (item) => item.name === "Tech Support"
  );
  const onSubmit = async (value: any) => {
    if (value.role_id === techSupport?.id) {
      value.team_id = null;

      id && (await userController.userPatch(value, id));
    } else {
      id && (await userController.userPatch(value, id));
    }

    refetch();
    document.location.replace("/#/users/");
  };
  const TeamData = useTeamData("");
  const noTeamOption = { label: " - - - - - -", value: "" };
  const TeamOption: { label: string; value: any }[] | undefined =
    TeamData?.data?.map((item) => ({
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
