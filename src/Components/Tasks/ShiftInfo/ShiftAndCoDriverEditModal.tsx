import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col } from "antd";

import { taskController } from "../../../API/LayoutApi/tasks";

interface ShiftAndCoDriverEditModalProps {
  open: boolean;
  onCancel: () => void;
  recordTask?: any;
}

const ShiftAndCoDriverEditModal: React.FC<ShiftAndCoDriverEditModalProps> = ({
  open,
  onCancel,
  recordTask,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (recordTask) {
      form.setFieldsValue({
        shift_date: recordTask.shift_date,
        shift_location: recordTask.shift_location,

        cycle_date: recordTask.cycle_date,
        cycle_location: recordTask.cycle_location,

        pickup_date: recordTask.pickup_date,
        pickup_time: recordTask.pickup_time,
        pickup_location: recordTask.pickup_location,

        driver_name: recordTask.driver_name,
        co_driver_name: recordTask.co_driver_name,
        co_driver_pickup_date: recordTask.co_driver_pickup_date,
        co_driver_pickup_time: recordTask.co_driver_pickup_time,
        co_driver_pickup_location: recordTask.co_driver_pickup_location,
        co_driver_drop_date: recordTask.co_driver_drop_date,
        co_driver_drop_time: recordTask.co_driver_drop_time,
        co_driver_drop_location: recordTask.co_driver_drop_location,
      });
    }
  }, [recordTask, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      taskController.taskPatch(values, recordTask.id);
      onCancel();
      form.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Shift & Co-Driver Data"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {/* shift */}
        <Form.Item label="Shift Date" name="shift_date">
          <Input placeholder="Date and Time" />
        </Form.Item>

        <Form.Item label="Shift Location" name="shift_location">
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* cycle */}

        <Form.Item label="Cycle Date" name="cycle_date">
          <Input placeholder="Date and Time" />
        </Form.Item>

        <Form.Item label="Cycle Location" name="cycle_location">
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* pick up */}

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Pick Up Date" name="pickup_date">
              <Input placeholder="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Pick Up Time" name="pickup_time">
              <Input placeholder="Time" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Pick Up Location" name="pickup_location">
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* co driver */}

        <Form.Item label="Driver Name" name="driver_name">
          <Input placeholder="Driver name" />
        </Form.Item>

        <Form.Item label="Co-Driver Name" name="co_driver_name">
          <Input placeholder="Co-driver name" />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="Co-Driver Pick Up Date"
              name="co_driver_pickup_date"
            >
              <Input placeholder="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Co-Driver Pick Up Time"
              name="co_driver_pickup_time"
            >
              <Input placeholder="Time" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Co-Driver Pick Up Location"
          name="co_driver_pickup_location"
        >
          <Input placeholder="Enter pickup location" />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Co-Driver Drop Date" name="co_driver_drop_date">
              <Input placeholder="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Co-Driver Drop Date" name="co_driver_drop_time">
              <Input placeholder="Time" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Co-Driver Drop Location"
          name="co_driver_drop_location"
        >
          <Input placeholder="Drop location" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShiftAndCoDriverEditModal;
