import { Modal, Form, Input, DatePicker, Switch } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
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

      const formattedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          dayjs.isDayjs(value) ? value.format("YYYY-MM-DD HH:mm:ss") : value,
        ])
      );

      onOk(formattedValues);
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
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
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
          <DatePicker
            style={{ width: "100%" }}
            format="MM-DD-YYYY hh:mm:ss A"
            showTime={{ format: "hh:mm:ss A" }}
          />
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
                form.resetFields(["pickup_date", "cycle_location"]);
              }
            }}
          />
        </Form.Item>

        {needsPickUp && (
          <>
            <Form.Item
              label="Pick Up Date"
              name="pickup_date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="MM-DD-YYYY hh:mm:ss A"
                showTime={{ format: "hh:mm:ss A" }}
              />
            </Form.Item>

            <Form.Item
              label="Pick Up Location"
              name="cycle_location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </>
        )}

        {/* DRIVER INFO */}

        <Form.Item label="CO-Driver Info">
          <Switch
            checked={needsDriver}
            onChange={(checked) => {
              setNeedsDriver(checked);
              if (!checked) {
                form.resetFields([
                  "driver_name",
                  "co_driver_name",
                  "co_driver_pickup_date",
                  "co_driver_pickup_location",
                  "co_driver_drop_date",
                  "co_driver_drop_location",
                ]);
              }
            }}
          />
        </Form.Item>

        {needsDriver && (
          <>
            <Form.Item label="Driver Name" name="driver_name">
              <Input placeholder="Driver name" />
            </Form.Item>

            <Form.Item label="Co-Driver Name" name="co_driver_name">
              <Input placeholder="Co-driver name" />
            </Form.Item>

            <Form.Item
              label="Co-Driver Pick Up Date"
              name="co_driver_pickup_date"
              rules={[{ required: true, message: "Please select pickup date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="MM-DD-YYYY hh:mm:ss A"
                showTime={{ format: "hh:mm:ss A" }}
              />
            </Form.Item>

            <Form.Item
              label="Co-Driver Pick Up Location"
              name="co_driver_pickup_location"
              rules={[
                { required: true, message: "Please enter pickup location" },
              ]}
            >
              <Input placeholder="Enter pickup location" />
            </Form.Item>

            <Form.Item
              label="Co-Driver Drop Date"
              name="co_driver_drop_date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="MM-DD-YYYY hh:mm:ss A"
                showTime={{ format: "hh:mm:ss A" }}
              />
            </Form.Item>
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
