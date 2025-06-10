import { useConfirmedMonths } from "../../Hooks/Accounting";
import { Button, Input, Select, Space, Table, theme } from "antd";
import tagIcon from "../../assets/tagIcon.svg";
import dayjs from "dayjs";
import { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function ConfirmedMonths() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const pageSizeOptions = [15, 20, 30, 40, 50];

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const Next = () => {
    const a = Number(page) + 1;
    setPage(a);
  };
  const Previos = () => {
    Number(page);
    if (page > 1) {
      const a = Number(page) - 1;
      setPage(a);
    }
  };

  const { data, isLoading, refetch } = useConfirmedMonths({
    page: page,
    page_size: pageSize,
  });

  const { token } = theme.useToken();

  return (
    <div>
      <Table
        size="middle"
        bordered
        dataSource={data?.data?.map((u: any, i: any) => ({
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
        pagination={false}
      />
      <Space style={{ width: "100%", marginTop: 40 }} direction="vertical">
        <Space
          style={{
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: token.colorBgContainer,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            padding: "10px 0",
            zIndex: 1000,
          }}
          wrap
        >
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 65, marginRight: 16 }}
            options={pageSizeOptions.map((size) => ({
              label: `${size}`,
              value: size,
            }))}
          />

          <Button
            onClick={Previos}
            disabled={data?.previous ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <LeftOutlined />
          </Button>
          <Input
            disabled
            style={{
              width: 40,
              textAlign: "center",
              background: token.colorBgContainer,
              border: "1px solid",
              borderColor: token.colorText,
              color: token.colorText,
            }}
            value={page}
            onChange={(e) => {
              let num = e.target.value;
              if (Number(num) && num !== "0") {
                setPage(Number(num));
              }
            }}
          />
          <Button
            onClick={Next}
            disabled={data?.next ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <RightOutlined />
          </Button>
        </Space>
      </Space>
    </div>
  );
}

export default ConfirmedMonths;
