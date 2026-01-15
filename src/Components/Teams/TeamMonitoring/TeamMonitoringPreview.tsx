import { useNavigate, useParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import {
  useDeleteTeamMonitor,
  useTeamsMonitorGetOne,
  useUpdateTeamMonitor,
} from "../../../Hooks/Teams";
import {
  Form,
  Spin,
  Space,
  Row,
  Col,
  Input,
  Button,
  Table,
  Modal,
  message,
  Typography,
} from "antd";
import Notfound from "../../../Utils/Notfound";
import tagIcon from "../../../assets/tagIcon.svg";
import { role } from "../../../App";
import moment from "moment";

const { Title, Text } = Typography;

type Params = {
  id: any;
};

const TeamMonitoringPreview = () => {
  const { id } = useParams<Params>();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useTeamsMonitorGetOne(id);
  const { mutate: deleteTeam, isLoading: deleteLoading } =
    useDeleteTeamMonitor();
  const { mutateAsync: updateTeam, isLoading: isSubmitting } =
    useUpdateTeamMonitor();

  if (isLoading) {
    return <Spin size="large" style={{ marginTop: 100 }} />;
  }

  if (!data) {
    return <Notfound />;
  }

  const handleSubmit = async (values: any) => {
    try {
      await updateTeam({
        id,
        payload: { name: values.name },
      });

      message.success("Team updated successfully");
      refetch();
    } catch {
      message.error("Failed to update team");
    }
  };

  const handleDelete = () => {
    if (deleteLoading) return;

    Modal.confirm({
      title: "Are you sure you want to delete this team?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () =>
        new Promise<void>((resolve, reject) => {
          deleteTeam(id, {
            onSuccess: () => {
              message.success("Team deleted successfully");
              navigate(-1);
              resolve();
            },
            onError: () => {
              message.error("Failed to delete team");
              reject();
            },
          });
        }),
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: <img src={tagIcon} alt="" />,
      key: "no",
      width: 60,
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Company name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3} style={{ marginBottom: 0 }}>
          {data.name}
        </Title>
        <Text type="secondary">
          Created at: {moment(data.created_at).format("DD.MM.YYYY HH:mm")}
        </Text>
      </div>

      {/* EDIT FORM */}
      <Form
        layout="vertical"
        initialValues={{ name: data.name }}
        onFinish={handleSubmit}
      >
        {/* COMPANIES TABLE */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data.companies}
          // pagination={false}
          size="middle"
          bordered
        />

        {/* ACTION BUTTONS */}
        <Form.Item style={{ marginTop: 24 }}>
          {role !== "Checker" && (
            <Button
              danger
              type="primary"
              onClick={handleDelete}
              loading={deleteLoading}
              style={{ marginRight: 8 }}
            >
              Delete
            </Button>
          )}
        </Form.Item>
      </Form>
    </Space>
  );
};

export default TeamMonitoringPreview;
