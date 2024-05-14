import { Button, Space, Table } from "antd";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import moment from "moment";
import { TRequests } from "../../types/Requests/TRequests";
import { useEffect, useState } from "react";
import { requestsController } from "../../API/LayoutApi/requests";
import { TPagination } from "../../types/common/TPagination";

const RequestsTable = ({
  data,
  isLoading,
  refetch,
  setOpenModal,
  setRequestData,
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestData: React.Dispatch<React.SetStateAction<TRequests | undefined>>;
  data: TRequests[] | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TPagination<TRequests[]>, unknown>>;
}) => {
  const [isTextSelected, setIsTextSelected] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setIsTextSelected(selection !== null && selection.toString() !== "");
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const Row = (record: TRequests, event: any) => {
    if (isTextSelected) {
      return;
    }
    if (
      event.target.classList.contains("ant-table-cell") &&
      record.status !== "Rejected"
    ) {
      setRequestData(record);
      setOpenModal(true);
    }
  };

  const patchRequest = (record: TRequests) => {
    requestsController
      .rejectPatch({ status: "Rejected" }, record?.id)
      .then(() => {
        refetch();
      });
  };

  const deleteRequest = (record: any) => {
    requestsController.delete(record.id).then(() => {
      refetch();
    });
  };
  return (
    <div>
      <Table
        onRow={(record) => ({
          onClick: (event) => Row(record, event),
        })}
        dataSource={data?.map((u, i) => ({
          no: i + 1,
          action: { id: u.id },
          created: moment(u?.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD.MM.YYYY HH:mm"
          ),
          ...u,
        }))}
        loading={isLoading}
        size="middle"
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            width: "5%",
          },
          {
            title: "Full name",
            dataIndex: "full_name",
            ellipsis: {
              showTitle: false,
            },
          },
          {
            title: "Company",
            dataIndex: "company_name",
            ellipsis: {
              showTitle: false,
            },
          },
          {
            title: "USDOT",
            dataIndex: "company_usdot",
            ellipsis: {
              showTitle: false,
            },
          },
          {
            title: "Created at",
            dataIndex: "created",
            ellipsis: {
              showTitle: false,
            },
          },
          {
            title: "Actions",
            dataIndex: "action",
            render: (text: string, record: TRequests) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {record?.status === "Pending" && (
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => patchRequest(record)}
                        danger
                      >
                        Reject
                      </Button>
                    </Space>
                  )}
                  {(record?.status === "Assigned" ||
                    record?.status === "Rejected") && (
                    <Space>
                      <Button
                        type="primary"
                        danger
                        onClick={(e) => deleteRequest(record)}
                      >
                        Delete
                      </Button>
                    </Space>
                  )}
                </div>
              );
            },
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
      />
    </div>
  );
};

export default RequestsTable;
