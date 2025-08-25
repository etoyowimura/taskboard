import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
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
        shift_date: recordTask.shift_date ? dayjs(recordTask.shift_date) : null,
        shift_location: recordTask.shift_location,

        cycle_date: recordTask.cycle_date ? dayjs(recordTask.cycle_date) : null,
        cycle_location: recordTask.cycle_location,

        pickup_date: recordTask.pickup_date
          ? dayjs(recordTask.pickup_date)
          : null,
        pickup_location: recordTask.pickup_location,

        driver_name: recordTask.driver_name,
        co_driver_name: recordTask.co_driver_name,
        co_driver_pickup_location: recordTask.co_driver_pickup_location,
        co_driver_pickup_date: recordTask.co_driver_pickup_date
          ? dayjs(recordTask.co_driver_pickup_date)
          : null,
        co_driver_drop_date: recordTask.co_driver_drop_date
          ? dayjs(recordTask.co_driver_drop_date)
          : null,
        co_driver_drop_location: recordTask.co_driver_drop_location,
      });
    }
  }, [recordTask, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Date fieldlarni string formatga o'tkazib yuboramiz
      const formattedValues = {
        ...values,
        shift_date: values.shift_date ? values.shift_date.toISOString() : null,
        pickup_date: values.pickup_date
          ? values.pickup_date.toISOString()
          : null,
        cycle_date: values.cycle_date ? values.cycle_date.toISOString() : null,
        co_driver_pickup_date: values.co_driver_pickup_date
          ? values.co_driver_pickup_date.toISOString()
          : null,
        co_driver_drop_date: values.co_driver_drop_date
          ? values.co_driver_drop_date.toISOString()
          : null,
      };
      taskController.taskPatch(formattedValues, recordTask.id);
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
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
        </Form.Item>

        <Form.Item label="Shift Location" name="shift_location">
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* cycle */}

        <Form.Item label="Cycle Date" name="cycle_date">
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
        </Form.Item>

        <Form.Item label="Cycle Location" name="cycle_location">
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* pick up */}

        <Form.Item label="Pick Up Date" name="pickup_date">
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
        </Form.Item>

        <Form.Item label="Pick Up Location" name="cycle_location">
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* co driver */}

        <Form.Item label="Driver Name" name="driver_name">
          <Input placeholder="Driver name" />
        </Form.Item>

        <Form.Item label="Co-Driver Name" name="co_driver_name">
          <Input placeholder="Co-driver name" />
        </Form.Item>

        <Form.Item label="Co-Driver Pick Up Date" name="co_driver_pickup_date">
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
        </Form.Item>

        <Form.Item
          label="Co-Driver Pick Up Location"
          name="co_driver_pickup_location"
        >
          <Input placeholder="Enter pickup location" />
        </Form.Item>

        <Form.Item label="Co-Driver Drop Date" name="co_driver_drop_date">
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
        </Form.Item>
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
