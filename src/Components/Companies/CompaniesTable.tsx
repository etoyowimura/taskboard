import React, { useState } from "react";
import { Button, Space, Table, Tooltip, message } from "antd";
import { Link } from "react-router-dom";
import { SyncOutlined, EyeOutlined } from "@ant-design/icons";
import { companyController } from "../../API/LayoutApi/companies";
import { TCompany } from "../../types/Company/TCompany";
// @ts-ignore
import zippy from "../../assets/zippyicon.svg";
// @ts-ignore
import evo from "../../assets/evoicon.png";
// @ts-ignore
import zeelog from "../../assets/zeelogicon.svg";
// @ts-ignore
import ontime from "../../assets/ontimeicon.svg";
// @ts-ignore
import tt from "../../assets/tticon.svg";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import { role } from "../../App";

function CompanyTable({
  data,
  isLoading,
}: {
  data?: TCompany[] | undefined;
  isLoading?: boolean;
}) {
  const moment = require("moment");
  const [loadings, setLoadings] = useState<boolean[]>([]);
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
      <Table
        dataSource={data?.map((u, i) => ({
          ...u,
          no: i + 1,
          created: moment(u?.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD.MM.YYYY HH:mm"
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
            width: "25%",
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
            title: "Team",
            dataIndex: "team",
            render: (status: string, record: TCompany) => (
              <span className={getStatusClassName()}>{record?.team?.name}</span>
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
            width: "10%",
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
        size="middle"
      />
    </div>
  );
}

export default CompanyTable;
