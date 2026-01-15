import { Modal, Form, Input, Button, Spin, message, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  useTeamsMonitorGetOne,
  useUpdateTeamMonitor,
} from "../../../Hooks/Teams";
import { debounce } from "lodash";
import { useCompanyData } from "../../../Hooks/Companies";

interface Props {
  open: boolean;
  id: any;
  onClose(): void;
  onSuccess(): void;
}

const EditTeamMonitorModal = ({ open, id, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const { data, isLoading } = useTeamsMonitorGetOne(id);
  const { mutate, isLoading: isSubmitting } = useUpdateTeamMonitor();

  /* ===== company search ===== */
  const [search, setSearch] = useState("");

  const debounceSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
      }, 500),
    []
  );

  const { data: companies, isLoading: companiesLoading } = useCompanyData({
    name: search,
  });

  const companyOptions = companies?.map((company) => ({
    label: company.name,
    value: company.id,
  }));

  /* ===== backend → form mapping ===== */
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        company_ids: data.companies?.map((c: any) => c.id),
      });
    }
  }, [data, form]);

  /* ===== submit ===== */
  const handleSubmit = (values: any) => {
    mutate(
      {
        id,
        payload: {
          name: values.name,
          company_ids: values.company_ids,
        },
      },
      {
        onSuccess: () => {
          message.success("Team updated successfully");
          onSuccess();
        },
        onError: () => {
          message.error("Failed to update team");
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      title="Edit Monitoring Team"
      onCancel={onClose}
      destroyOnClose
      confirmLoading={isSubmitting}
      onOk={() => form.submit()}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={() => form.submit()}
        >
          Save
        </Button>,
      ]}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          key={id}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false}
        >
          <Form.Item
            label="Team name"
            name="name"
            rules={[{ required: true, message: "Please enter team name" }]}
          >
            <Input placeholder="Team name" />
          </Form.Item>

          <Form.Item label="Assign Companies" name="company_ids">
            <Select
              mode="multiple"
              showSearch
              placeholder="Select companies"
              onSearch={debounceSearch}
              filterOption={false}
              options={companyOptions}
              notFoundContent={companiesLoading ? <Spin size="small" /> : null}
              allowClear
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditTeamMonitorModal;
