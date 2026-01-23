import { Modal, Form, Select, message } from "antd";
import {
  useTeamsMonitorData,
  useUpdateTeamMonitorCompanies,
} from "../../Hooks/Teams";

interface Props {
  open: boolean;
  selectedIds: number[];
  onCancel: () => void;

  refetch: any;
}

const BulkEditModal = ({ open, selectedIds, onCancel, refetch }: Props) => {
  const [form] = Form.useForm();

  const { data, isLoading: teamsLoading } = useTeamsMonitorData({});
  const updateMutation = useUpdateTeamMonitorCompanies();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await updateMutation.mutateAsync({
        id: String(values.monitoringTeamId),
        payload: {
          company_ids: selectedIds,
        },
      });

      message.success("Monitoring team updated successfully");
      form.resetFields();
      refetch();
      onCancel();
    } catch (error: any) {
      console.log(error?.message || error || "Something went wrong");
    }
  };

  return (
    <Modal
      title={`Monitoring Team Bulk Edit (${selectedIds.length})`}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Save"
      confirmLoading={updateMutation.isLoading}
      okButtonProps={{
        disabled: updateMutation.isLoading || selectedIds.length === 0,
      }}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Monitoring Team"
          name="monitoringTeamId"
          rules={[
            { required: true, message: "Please select a monitoring team" },
          ]}
        >
          <Select
            placeholder="Select monitoring team"
            allowClear
            loading={teamsLoading}
            showSearch
            optionFilterProp="label"
            disabled={updateMutation.isLoading}
            options={data?.map((team: any) => ({
              value: team.id,
              label: team.name,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BulkEditModal;
