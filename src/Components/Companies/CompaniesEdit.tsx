import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyOne } from "../../Hooks/Companies";
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
  Tag,
  Radio,
  RadioChangeEvent,
  Select,
  theme,
} from "antd";
import { companyController } from "../../API/LayoutApi/companies";
import {
  DashboardOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Notfound from "../../Utils/Notfound";
import Table from "antd/es/table";
import AddDriver from "./AddDriver";
import { role } from "../../App";
import { useTeamData } from "../../Hooks/Teams";
import { useCustomerByComanyData } from "../../Hooks/Customers";
import { StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
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
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
// @ts-ignore
import infoIcon from "../../assets/infoIcon.png";
// @ts-ignore
import infoIconActive from "../../assets/infoIconActive.png";
const TabPane = Tabs.TabPane;
type params = {
  readonly id: any;
};

const CompanyEdit = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { id } = useParams<params>();
  const customerData = useCustomerByComanyData({ page, page_size: 10 }, id);
  const { data, refetch, status } = useCompanyOne(id);

  const { token } = theme.useToken();

  const showModal = () => {
    setOpen(true);
  };
  let navigate = useNavigate();

  const onSubmit = async (value: any) => {
    value.team_id = team;
    await companyController.companyPatch(value, id);
    refetch();
    navigate(-1);
  };

  const ClickDelete = () => {
    const shouldDelete = window.confirm(
      "Вы уверены, что хотите удалить эту компанию?"
    );
    if (shouldDelete && id !== undefined) {
      companyController.deleteCompanyController(id).then(() => {
        document.location.replace(`/#/companies`);
      });
    }
  };
  const [value, setValue] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  const [activeTab, setActiveTab] = useState("1");

  const TeamData = useTeamData({});
  const noTeamOption = { label: " - - - - - -", value: "" };
  const TeamOption: { label: string; value: any }[] | undefined =
    TeamData?.data?.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));
  if (TeamOption) {
    TeamOption.unshift(noTeamOption);
  }

  const [team, setTeam] = useState<string | undefined>();

  const Next = () => {
    const a = Number(page) + 1;
    setPage(a);
  };
  const Previos = () => {
    Number(page);
    if (page > 1) {
      const a = Number(page) - 1;
      setPage(a);
    }
  };

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
                              label={"Name"}
                              name="name"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="USDOT"
                              name="usdot"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Team"
                            >
                              <Select
                                options={TeamOption}
                                defaultValue={data?.team?.name}
                                onChange={(e: string) => setTeam(e)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={[16, 10]}>
                          <Col span={6}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="API Key"
                              name="api_key"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              wrapperCol={{ span: "100%" }}
                              label="Source"
                              name="source"
                            >
                              <Radio.Group
                                onChange={onChange}
                                value={value}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Radio value="TT">
                                  <img
                                    style={{ width: 50, height: 50 }}
                                    src={tt}
                                    alt=""
                                  />
                                </Radio>
                                <Radio value="EVO">
                                  <img
                                    style={{ width: 50, height: 50 }}
                                    src={evo}
                                    alt=""
                                  />
                                </Radio>
                                <Radio value="Zippy">
                                  <img
                                    style={{ width: 50, height: 50 }}
                                    src={zippy}
                                    alt=""
                                  />
                                </Radio>
                                <Radio value="Ontime">
                                  <img
                                    style={{ width: 50, height: 50 }}
                                    src={ontime}
                                    alt=""
                                  />
                                </Radio>
                                <Radio value="Zeelog">
                                  <img
                                    style={{ width: 50, height: 50 }}
                                    src={zeelog}
                                    alt=""
                                  />
                                </Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
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
                          {role !== "Checker" && (
                            <Button type="primary" htmlType="submit">
                              Submit
                            </Button>
                          )}
                        </Form.Item>
                      </Form>
                    </Space>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <DashboardOutlined />
                        Drivers
                      </span>
                    }
                    key="2"
                  >
                    <Table
                      onRow={(record) => {
                        let isTextSelected = false;
                        document.addEventListener("selectionchange", () => {
                          const selection = window.getSelection();
                          if (
                            selection !== null &&
                            selection.toString() !== ""
                          ) {
                            isTextSelected = true;
                          } else {
                            isTextSelected = false;
                          }
                        });
                        return {
                          onClick: (event: any) => {
                            if (isTextSelected) {
                            }
                            document.location.replace(
                              `/#/customers/${record.id}`
                            );
                          },
                        };
                      }}
                      dataSource={customerData.data?.data?.map((u, i) => ({
                        ...u,
                        no: i + 1,
                        key: u?.id,
                      }))}
                      columns={[
                        {
                          title: <img src={tagIcon} alt="" />,
                          dataIndex: "no",
                        },
                        {
                          title: "Name",
                          dataIndex: "name",
                        },
                        {
                          title: "Role",
                          dataIndex: "profession",
                        },
                        {
                          title: "Is Active",
                          dataIndex: "is_active",
                          render: (tag: boolean) => (
                            <Tag color={tag ? "geekblue" : "red"}>
                              {tag ? "True" : "False"}
                            </Tag>
                          ),
                          filters: [
                            {
                              text: "True",
                              value: true,
                            },
                            {
                              text: "False",
                              value: false,
                            },
                          ],
                          onFilter: (value: any, record: any) => {
                            return record.isActive === value;
                          },
                        },
                      ]}
                      pagination={false}
                    />
                    <Space
                      style={{ width: "100%", marginTop: 10 }}
                      direction="vertical"
                    >
                      <Space
                        style={{
                          justifyContent: "end",
                          position: "fixed",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          // backgroundColor: token.colorBgContainer,
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                          padding: "10px 0",
                          zIndex: 1000,
                        }}
                        wrap
                      >
                        <Button
                          onClick={Previos}
                          disabled={customerData.data?.previous ? false : true}
                          style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                            border: "none",
                          }}
                        >
                          <LeftOutlined />
                        </Button>
                        <Input
                          disabled
                          style={{
                            width: 40,
                            textAlign: "center",
                            background: token.colorBgContainer,
                            border: "1px solid",
                            borderColor: token.colorText,
                            color: token.colorText,
                          }}
                          value={page}
                          onChange={(e) => {
                            let num = e.target.value;
                            if (Number(num) && num !== "0") {
                              setPage(Number(num));
                            }
                          }}
                        />
                        <Button
                          onClick={Next}
                          disabled={customerData.data?.next ? false : true}
                          style={{
                            backgroundColor: token.colorBgContainer,
                            color: token.colorText,
                            border: "none",
                          }}
                        >
                          <RightOutlined />
                        </Button>
                      </Space>
                    </Space>
                    {open && (
                      <AddDriver id={id} open={open} setOpen={setOpen} />
                    )}
                    <Button
                      type="primary"
                      style={{ marginLeft: "auto" }}
                      size={"middle"}
                      onClick={showModal}
                      disabled={role !== "Owner"}
                    >
                      Add Driver
                    </Button>
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

export default CompanyEdit;
