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
  Select,
  Modal,
} from "antd";
import { customerController } from "../../API/LayoutApi/customers";
import Notfound from "../../Utils/Notfound";
import { role } from "../../App";
import { useState } from "react";
// @ts-ignore
import infoIcon from "../../assets/infoIcon.png";
// @ts-ignore
import infoIconActive from "../../assets/infoIconActive.png";
// @ts-ignore
import zippy from "../../assets/zippyicon.svg";
// @ts-ignore
import evo from "../../assets/evoicon.png";
// @ts-ignore
import zeelog from "../../assets/zeelogicon.svg";
// @ts-ignore
import ontime from "../../assets/ontimeicon.svg";
// @ts-ignore
import tt from "../../assets/tticon.svg";
import { useCompanyData } from "../../Hooks/Companies";
import ReactCountryFlag from "react-country-flag";

const TabPane = Tabs.TabPane;

const { Option } = Select;

type params = {
  readonly id: any;
};

const CustomerEdit = () => {
  const { id } = useParams<params>();
  const { data, status, refetch } = useCustomerOne(id);
  let navigate = useNavigate();
  const onSubmit = async (value: any) => {
    value.company_id = companyVal;
    await customerController.customerPatch(value, id);
    window.location.replace("/#/customers/");
    refetch();
  };

  const ClickDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this Driver?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",

      onOk() {
        if (id !== undefined) {
          customerController.deleteCustomerController(id);
          navigate("/customers/");
          refetch();
        }
      },
    });
  };
  const [activeTab, setActiveTab] = useState("1");

  const getImageSource = (source: string) => {
    switch (source) {
      case "Zippy":
        return zippy;
      case "EVO":
        return evo;
      case "Ontime":
        return ontime;
      case "Zeelog":
        return zeelog;
      case "TT":
        return tt;
      default:
        return tt;
    }
  };

  const [companyName, setCompanyName] = useState<string>("");
  const [companyVal, setCompanyVal] = useState<any>();
  const { data: companyData } = useCompanyData({
    name: companyName,
  });

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
                              <Select
                                showSearch
                                defaultValue={data?.company?.name}
                                onSearch={(value: any) => setCompanyName(value)}
                                onChange={(e: any) => {
                                  setCompanyVal(e);
                                }}
                                options={companyData?.map((item) => ({
                                  label: (
                                    <div>
                                      {item?.source && (
                                        <img
                                          style={{
                                            width: 15,
                                            height: 20,
                                            paddingTop: 7,
                                          }}
                                          src={getImageSource(item?.source)}
                                          alt=""
                                        />
                                      )}{" "}
                                      {item?.name}
                                    </div>
                                  ),
                                  value: item?.id,
                                }))}
                                filterOption={false}
                                autoClearSearchValue={false}
                                allowClear
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

                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Group Chat ID"
                              name="telegram_group_id"
                            >
                              <Input placeholder="Enter Group ID" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Chat Language"
                              name="language"
                            >
                              <Select allowClear placeholder="Select Language">
                                <Option value="ru">
                                  <ReactCountryFlag
                                    countryCode="RU"
                                    svg
                                    style={{ marginRight: 8 }}
                                  />
                                  Russian
                                </Option>
                                <Option value="en">
                                  <ReactCountryFlag
                                    countryCode="GB"
                                    svg
                                    style={{ marginRight: 8 }}
                                  />
                                  English
                                </Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item>
                          {(role === "Owner" || role === "Tech Support") && (
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
