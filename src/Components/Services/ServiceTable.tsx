import React from "react";
import { Table } from "antd";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { TService } from "../../types/Service/TService";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import { role } from "../../App";
import { theme } from "antd";

type numStr = string | number;

interface serviceSource {
  no: numStr;
  title: numStr;
  points: numStr;
  id: numStr;
  action: { id: numStr };
  key: React.Key;
}
const ServiceTable = ({
  data,
  isLoading,
  refetch,
}: {
  data: TService[] | undefined;
  isLoading: boolean | undefined;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TService[], unknown>>;
}) => {
  const columns: object[] = [
    {
      title: <img src={tagIcon} alt="" />,
      dataIndex: "no",
      width: "5%",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Points",
      dataIndex: "points",
    },
  ];

  const { token } = theme.useToken();

  return (
    <div>
      <Table
        loading={isLoading}
        onRow={(record) => {
          return {
            onClick: () => {
              role !== "Checker" &&
                document.location.replace(`/#/services/${record.id}`);
            },
          };
        }}
        dataSource={data?.map((u: any, i: number): serviceSource => {
          const obj: serviceSource = {
            no: i + 1,
            title: u?.title,
            points: u?.points,
            id: u?.id,
            action: { id: u.id },
            key: u.id,
          };
          return obj;
        })}
        columns={columns}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
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
        }}
        bordered
      />
    </div>
  );
};

export default ServiceTable;
