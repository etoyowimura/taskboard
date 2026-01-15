import { Input, Modal, Form as FormAnt, Select } from "antd";
import { useUserData } from "../../../Hooks/Users";
import { teamController } from "../../../API/LayoutApi/teams";

const AddTeam = ({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen(open: boolean): void;
  refetch(): void;
}) => {
  const [form] = FormAnt.useForm();
  const handleCancel = () => {
    setOpen(!open);
  };
  const { data } = useUserData({ name: "", team: "", role: "Checker" });

  return (
    <div>
      <Modal
        open={open}
        title="Add new team"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then(async (values) => {
              form.resetFields();
              await teamController.addTeamController(values);
              setOpen(!open);
              refetch();
            })
            .catch(() => {
              refetch();
            });
        }}
      >
        <FormAnt
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <FormAnt.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input team name!" }]}
          >
            <Input />
          </FormAnt.Item>
          <FormAnt.Item
            label="Include users to this team"
            name="user_ids"
            rules={[
              { required: false, message: "Please input company status!" },
            ]}
          >
            <Select
              mode="multiple"
              showSearch
              options={data?.map(
                (item: any): { label: string; value: number } => ({
                  label: item.username,
                  value: item.id,
                })
              )}
              filterOption={(input: string, option?: { label?: string }) =>
                option?.label?.toLowerCase().includes(input.toLowerCase()) ??
                false
              }
            />
          </FormAnt.Item>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddTeam;
