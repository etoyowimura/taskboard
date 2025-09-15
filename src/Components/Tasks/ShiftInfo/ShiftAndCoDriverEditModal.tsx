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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await taskController.taskPatch(values, recordTask.id);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  useEffect(() => {
    if (recordTask && open) {
      form.resetFields();
      form.setFieldsValue(recordTask);
    }
  }, [recordTask, open]);

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
      <Form
        key={recordTask?.id}
        form={form}
        initialValues={recordTask}
        layout="vertical"
      >
        {/* shift */}
        <Form.Item
          label="Shift Date"
          name="shift_date"
          rules={[
            {
              required: !!recordTask?.shift_date,
              message: "Shift Date is required",
            },
          ]}
        >
          <Input placeholder="Date and Time" />
        </Form.Item>

        <Form.Item
          label="Shift Location"
          name="shift_location"
          rules={[
            {
              required: !!recordTask?.shift_location,
              message: "Shift Location is required",
            },
          ]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* cycle */}

        <Form.Item
          label="Cycle Date"
          name="cycle_date"
          rules={[
            {
              required: !!recordTask?.cycle_date,
              message: "Cycle Date is required",
            },
          ]}
        >
          <Input placeholder="Date and Time" />
        </Form.Item>

        <Form.Item
          label="Cycle Location"
          name="cycle_location"
          rules={[
            {
              required: !!recordTask?.cycle_location,
              message: "Cycle Location is required",
            },
          ]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* pick up */}

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="Pick Up Date"
              name="pickup_date"
              rules={[
                {
                  required: !!recordTask?.pickup_date,
                  message: "Pick Up Date is required",
                },
              ]}
            >
              <Input placeholder="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Pick Up Time"
              name="pickup_time"
              rules={[
                {
                  required: !!recordTask?.pickup_time,
                  message: "Pick Up Time is required",
                },
              ]}
            >
              <Input placeholder="Time" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Pick Up Location"
          name="pickup_location"
          rules={[
            {
              required: !!recordTask?.pickup_location,
              message: "Pick Up Location is required",
            },
          ]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* co driver */}

        <Form.Item
          label="Driver Name"
          name="driver_name"
          rules={[
            {
              required: !!recordTask?.driver_name,
              message: "Driver Name is required",
            },
          ]}
        >
          <Input placeholder="Driver name" />
        </Form.Item>

        <Form.Item
          label="Co-Driver Name"
          name="co_driver_name"
          rules={[
            {
              required: !!recordTask?.co_driver_name,
              message: "Co-Driver Name is required",
            },
          ]}
        >
          <Input placeholder="Co-driver name" />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="Co-Driver Pick Up Date"
              name="co_driver_pickup_date"
              rules={[
                {
                  required: !!recordTask?.co_driver_pickup_date,
                  message: "Co-Driver Pick Up Date is required",
                },
              ]}
            >
              <Input placeholder="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Co-Driver Pick Up Time"
              name="co_driver_pickup_time"
              rules={[
                {
                  required: !!recordTask?.co_driver_pickup_time,
                  message: "Co-Driver Pick Up Time is required",
                },
              ]}
            >
              <Input placeholder="Time" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Co-Driver Pick Up Location"
          name="co_driver_pickup_location"
          rules={[
            {
              required: !!recordTask?.co_driver_pickup_location,
              message: "Co-Driver Pick Up Location is required",
            },
          ]}
        >
          <Input placeholder="Enter pickup location" />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="Co-Driver Drop Date"
              name="co_driver_drop_date"
              rules={[
                {
                  required: !!recordTask?.co_driver_drop_date,
                  message: "Co-Driver Drop Date is required",
                },
              ]}
            >
              <Input placeholder="Date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Co-Driver Drop Time"
              name="co_driver_drop_time"
              rules={[
                {
                  required: !!recordTask?.co_driver_drop_time,
                  message: "Co-Driver Drop Time is required",
                },
              ]}
            >
              <Input placeholder="Time" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Co-Driver Drop Location"
          name="co_driver_drop_location"
          rules={[
            {
              required: !!recordTask?.co_driver_drop_location,
              message: "Co-Driver Drop Location is required",
            },
          ]}
        >
          <Input placeholder="Drop location" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShiftAndCoDriverEditModal;
