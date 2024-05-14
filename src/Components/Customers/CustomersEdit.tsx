import { useParams, useNavigate } from "react-router-dom";
import { useCustomerOne } from "../../Hooks/Customers";

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
} from "antd";
import { customerController } from "../../API/LayoutApi/customers";
import Notfound from "../../Utils/Notfound";
import { role } from "../../App";
import { useState } from "react";
// @ts-ignore
import infoIcon from "../../assets/infoIcon.png";
// @ts-ignore
import infoIconActive from "../../assets/infoIconActive.png";

const TabPane = Tabs.TabPane;

type params = {
  readonly id: any;
};

const CustomerEdit = () => {
  const { id } = useParams<params>();
  const { data, refetch, status } = useCustomerOne(id);
  let navigate = useNavigate();
  const onSubmit = async (value: any) => {
    await customerController.customerPatch(value, id);
    navigate(-1);
  };

  const ClickDelete = () => {
    const shouldDelete = window.confirm(
      "Are you sure, you want to delete this Driver?"
    );
    if (shouldDelete && id !== undefined) {
      customerController.deleteCustomerController(id);
      navigate(-1);
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
            <Spin size="large" spinning={!data}>
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
                              label="Company"
                            >
                              <Input
                                defaultValue={data?.company?.name}
                                readOnly
                              />
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Name"
                              name="name"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item>
                          {role === "Owner" && (
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
            </Spin>
          ) : (
            <Notfound />
          )}
        </Watermark>
      </Spin>
    </div>
  );
};

export default CustomerEdit;
