import { useConfirmedMonths } from "../../Hooks/Accounting";
import { Button, Table, theme } from "antd";
import tagIcon from "../../assets/tagIcon.svg";
import dayjs from "dayjs";

function ConfirmedMonths() {
  const { data, isLoading, refetch } = useConfirmedMonths();

  const { token } = theme.useToken();

  return (
    <div>
      <Table
        size="middle"
        bordered
        dataSource={data?.map((u, i) => ({
          no: i + 1,
          ...u,
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            key: "no",
            width: "5%",
            align: "center",
          },
          {
            title: "Year",
            dataIndex: "year",
            key: "year",
            width: "20%",
          },
          {
            title: "Month",
            dataIndex: "month",
            key: "month",
            width: "20%",
          },
          {
            title: "Confirmed",
            dataIndex: "created_at",
            key: "created_at",
            width: "30%",
            render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm"),
          },
          {
            title: "Action",
            key: "action",
            align: "center",
            width: "10%",
            render: (_: any, record: any) => (
              <Button
                type="primary"
                href={record.salary_document_path}
                target="_blank"
              >
                Download
              </Button>
            ),
          },
        ]}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          size: "default",
          style: {
            margin: 0,
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: token.colorBgContainer,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            padding: "10px 0",
            zIndex: 1000,
          },
          showLessItems: true,
        }}
      />
    </div>
  );
}

export default ConfirmedMonths;
