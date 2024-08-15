import { Input, Modal, Form as FormAnt } from "antd";
import { customerController } from "../../API/LayoutApi/customers";
import { useCompanyOne } from "../../Hooks/Companies";
const AddDriver = ({
  open,
  id,
  setOpen,
}: {
  id: number | undefined;
  open: boolean;
  setOpen(open: boolean): void;
}) => {
  const [form] = FormAnt.useForm();
  const companyData = useCompanyOne(id);
  const handleCancel = () => {
    setOpen(!open);
  };
  return (
    <div>
      <Modal
        open={open}
        title="Add Driver"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form.validateFields().then(async (values) => {
            form.resetFields();
            const updatedValues = { ...values };
            updatedValues.company_id = id;
            await customerController.addCustomerController(updatedValues);
            setOpen(!open);
          });
        }}
      >
        <FormAnt
          form={form}
          layout="horizontal"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <FormAnt.Item label="Company" name="company_id">
            <Input defaultValue={companyData.data?.name} readOnly />
          </FormAnt.Item>
          <FormAnt.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input Name!" }]}
          >
            <Input />
          </FormAnt.Item>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddDriver;
