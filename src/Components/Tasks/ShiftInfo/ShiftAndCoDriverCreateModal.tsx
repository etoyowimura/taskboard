import { Modal, Form, Input, Switch, Row, Col } from "antd";
import { useState } from "react";

import { TTask } from "../../../types/Tasks/TTasks";

interface ShiftAndCoDriverCreateModalProps {
  open: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  recordTask?: TTask | any;
}

const ShiftAndCoDriverCreateModal: React.FC<
  ShiftAndCoDriverCreateModalProps
> = ({ open, onOk, onCancel, recordTask }) => {
  const [form] = Form.useForm();
  const [needsDriver, setNeedsDriver] = useState(false);
  const [needsPickUp, setNeedsPickUp] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      onOk(values);
      form.resetFields();
    } catch (err) {
      console.log("Validation error:", err);
    }
  };

  return (
    <Modal
      title="Shift and Cycle & Co-Driver Info"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          driver_name: recordTask?.customer?.name,
        }}
      >
        {/* SHIFT INFO */}
        <Form.Item
          label="Shift Date"
          name="shift_date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <Input placeholder="Date and Time" />
        </Form.Item>

        <Form.Item
          label="Shift Location"
          name="shift_location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* Cycle info */}

        <Form.Item
          label="Cycle Date"
          name="cycle_date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <Input placeholder="Date and Time" />
        </Form.Item>

        <Form.Item
          label="Cycle Location"
          name="cycle_location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* Pick Up */}

        <Form.Item label="Pick Up Info">
          <Switch
            checked={needsPickUp}
            onChange={(checked) => {
              setNeedsPickUp(checked);
              if (!checked) {
                form.resetFields([
                  "pickup_date",
                  "pickup_location",
                  "pickup_time",
                ]);
              }
            }}
          />
        </Form.Item>

        {needsPickUp && (
          <>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="Pick Up Date"
                  name="pickup_date"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <Input placeholder="Date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Pick Up Time"
                  name="pickup_time"
                  rules={[{ required: true, message: "Please select time" }]}
                >
                  <Input placeholder="Time" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Pick Up Location"
              name="pickup_location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </>
        )}

        {/* DRIVER INFO */}

        <Form.Item label="Co-Driver Info">
          <Switch
            checked={needsDriver}
            onChange={(checked) => {
              setNeedsDriver(checked);
              if (!checked) {
                form.resetFields([
                  "driver_name",
                  "co_driver_name",
                  "co_driver_pickup_date",
                  "co_driver_pickup_time",
                  "co_driver_pickup_location",
                  "co_driver_drop_date",
                  "co_driver_drop_time",
                  "co_driver_drop_location",
                ]);
              }
            }}
          />
        </Form.Item>

        {needsDriver && (
          <>
            <Form.Item
              label="Driver Name"
              name="driver_name"
              rules={[{ required: true, message: "Please enter driver name" }]}
            >
              <Input placeholder="Driver name" />
            </Form.Item>

            <Form.Item
              label="Co-Driver Name"
              name="co_driver_name"
              rules={[
                { required: true, message: "Please enter co driver name" },
              ]}
            >
              <Input placeholder="Co-driver name" />
            </Form.Item>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="Co-Driver Pick Up Date"
                  name="co_driver_pickup_date"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <Input placeholder="Date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Co-Driver Pick Up Time"
                  name="co_driver_pickup_time"
                  rules={[{ required: true, message: "Please select time" }]}
                >
                  <Input placeholder="Time" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Co-Driver Pick Up Location"
              name="co_driver_pickup_location"
              rules={[
                { required: true, message: "Please enter pickup location" },
              ]}
            >
              <Input placeholder="Enter pickup location" />
            </Form.Item>

            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label="Co-Driver Drop Date"
                  name="co_driver_drop_date"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <Input placeholder="Date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Co-Driver Drop Time"
                  name="co_driver_drop_time"
                  rules={[{ required: true, message: "Please select time" }]}
                >
                  <Input placeholder="Time" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Co-Driver Drop Location"
              name="co_driver_drop_location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Drop location" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ShiftAndCoDriverCreateModal;
