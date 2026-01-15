import { Input, Modal, Form, Select, message, Spin } from "antd";

import { useCompanyData } from "../../../Hooks/Companies";
import { useMemo, useState } from "react";
import { debounce } from "lodash";
import { useCreateTeamMonitor } from "../../../Hooks/Teams";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  refetch(): void;
}

const CreateModal = ({ open, setOpen, refetch }: Props) => {
  const [form] = Form.useForm();

  const [search, setSearch] = useState("");

  const debounceSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
      }, 500),
    []
  );

  const handleSearch = (val: string) => {
    debounceSearch(val);
  };

  const { data: companies, isLoading } = useCompanyData({ name: search });

  //@ts-ignores
  const ComaniesOptions = companies?.map((company) => ({
    label: company.name,
    value: company.id,
  }));

  const { mutate, isLoading: isSubmitting } = useCreateTeamMonitor();

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      mutate(
        {
          name: values.name,
          company_ids: values.company_ids || [],
        },
        {
          onSuccess: () => {
            message.success("Team successfully created");
            handleCancel();
            refetch();
          },
          onError: (error: any) => {
            message.error("Failed to create team");
            console.error(error);
          },
        }
      );
    } catch (validationError: any) {
      if (validationError.errorFields) {
        message.error("Please fill all required fields correctly");
      } else {
        message.error("An unexpected error occurred");
        console.error(validationError);
      }
    }
  };

  return (
    <Modal
      open={open}
      title="Add New Team"
      okText="Create"
      cancelText="Cancel"
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      okButtonProps={{ disabled: isSubmitting }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Team Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter team name",
            },
          ]}
        >
          <Input placeholder="Enter team name" />
        </Form.Item>

        <Form.Item label="Assign Companies" name="company_ids">
          <Select
            mode="multiple"
            showSearch
            placeholder="Select companies"
            onSearch={handleSearch}
            filterOption={false}
            notFoundContent={isLoading ? <Spin size="small" /> : null}
            options={ComaniesOptions}
            optionLabelProp="label"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
