import { Form, Tabs, Row, Col, Input, Modal, Button, Select } from "antd";
import { useState } from "react";
import { useCompanyData } from "../../Hooks/Companies";
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
import { useCustomerByComanyData } from "../../Hooks/Customers";
const TabPane = Tabs.TabPane;

const AssignedEdit = ({ recordData, editOpen, setEditOpen }: any) => {
  const handleCancel = () => {
    setEditOpen(!editOpen);
  };
  const onSubmit = () => {};

  const [companyName, setCompanyName] = useState<string>();
  const [companyId, setCompanyId] = useState<number>();
  const [customerName, setCustomerName] = useState<string>();

  const companyData = useCompanyData({ name: companyName });
  const customerData = useCustomerByComanyData({
    id: companyId,
    name: customerName,
  });


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
  return (
    <Modal
      onCancel={handleCancel}
      footer={null}
      open={editOpen}
      width={800}
      maskClosable={true}
    >
      <Form
        name="basic"
        layout="vertical"
        wrapperCol={{ span: 16 }}
        initialValues={{ ...recordData }}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <Row gutter={[16, 10]}>
          <Col span={6}>
            <Form.Item
              wrapperCol={{ span: "100%" }}
              label="Company"
              name="company"
            >
              <Select
                showSearch
                placeholder="Search Company"
                onSearch={(value: any) => setCompanyName(value)}
                options={companyData?.data?.map((item) => ({
                  label: (
                    <div>
                      {item?.source && (
                        <img
                          style={{ width: 15, height: 20, paddingTop: 7 }}
                          src={getImageSource(item?.source)}
                          alt=""
                        />
                      )}{" "}
                      {item?.name}
                    </div>
                  ),
                  value: item?.id,
                }))}
                value={companyName}
                filterOption={false}
                autoClearSearchValue={false}
                allowClear
                onChange={(value: any) => setCompanyId(value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              wrapperCol={{ span: "100%" }}
              label="Driver"
              name="customer"
            >
              <Select
                showSearch
                placeholder="Search Driver"
                onSearch={(value: any) => setCustomerName(value)}
                options={customerData?.data?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                value={customerName}
                filterOption={false}
                autoClearSearchValue={false}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignedEdit;
