import { Button, Space, Table, Tooltip } from "antd";
import { useState } from "react";

import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { TCompany } from "../../types/Company/TCompany";

import BulkEditModal from "./BulkEditModal";

import zippy from "../../assets/zippyicon.svg";
import evo from "../../assets/evoicon.png";
import zeelog from "../../assets/zeelogicon.svg";
import ontime from "../../assets/ontimeicon.svg";
import tt from "../../assets/tticon.svg";
import tagIcon from "../../assets/tagIcon.svg";
import { role } from "../../App";

function CompanyTable({
  data,
  isLoading,
  refetch,
}: {
  data?: TCompany[] | undefined;
  isLoading?: boolean;
  refetch?: any;
}) {
  const moment = require("moment");

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: TCompany[]) => {
      setSelectedRowKeys(keys);
      setSelectedIds(rows.map((row) => row?.id));
    },
  };

  function getStatusClassName() {
    if (role !== "Owner") {
      return "isnot";
    } else if (role === "Owner") {
      return "super";
    }
  }

  const getImageSource = (source: string) => {
    switch (source) {
      case "Zippy":
        return zippy;
      case "EVO":
        return evo;
      case "Ontime":
        return ontime;
      case "Zeelog":
        return zeelog;
      case "TT":
        return tt;
      default:
        return tt;
    }
  };

  return (
    <div>
      {selectedIds.length !== 0 && (
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <Button
            type="primary"
            disabled={selectedIds.length === 0}
            onClick={() => setIsBulkModalOpen(true)}
          >
            Bulk Edit
          </Button>
        </div>
      )}
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        dataSource={data?.map((u, i) => ({
          ...u,
          no: i + 1,
          created: moment(u?.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD.MM.YYYY HH:mm",
          ),
          key: u?.id,
          action: { ...u },
        }))}
        loading={isLoading}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            width: "5%",
          },
          {
            title: "Company",
            dataIndex: "name",
            width: "20%",
            ellipsis: {
              showTitle: false,
            },
            render: (text, record) => (
              <Tooltip placement="topLeft" title={text}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {record?.source && (
                    <img
                      src={getImageSource(record?.source)}
                      alt=""
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    />
                  )}
                  {text}
                </div>
              </Tooltip>
            ),
          },
          {
            title: "Service Team",
            dataIndex: "team",
            render: (status: string, record: TCompany) => (
              <span className={getStatusClassName()}>{record?.team?.name}</span>
            ),
          },
          {
            title: "Monitoring Team",
            dataIndex: "team_monitoring",
            render: (status: string, record: TCompany) => (
              <span className={getStatusClassName()}>
                {record?.team_monitoring?.name}
              </span>
            ),
          },
          {
            title: "USDOT",
            dataIndex: "usdot",
          },
          {
            title: "API KEY",
            dataIndex: "api_key",
            render: (status: string, record: TCompany) => (
              <span className={getStatusClassName()}>{status}</span>
            ),
          },
          {
            title: "Created at",
            dataIndex: "created",
            responsive: ["lg"],
          },
          {
            width: "8%",
            title: "Actions",
            dataIndex: "action",
            render: ({ id }: { id: string }) => {
              return (
                <Space>
                  <Link to={`${id}`}>
                    {role !== "Checker" && <Button type="primary">Edit</Button>}
                    {role === "Checker" && (
                      <Button type="primary" icon={<EyeOutlined />}></Button>
                    )}
                  </Link>
                </Space>
              );
            },
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        size="small"
        scroll={{ x: "768px" }}
        pagination={false}
        bordered
      />
      <BulkEditModal
        open={isBulkModalOpen}
        selectedIds={selectedIds}
        onCancel={() => setIsBulkModalOpen(false)}
        refetch={refetch}
      />
    </div>
  );
}

export default CompanyTable;
