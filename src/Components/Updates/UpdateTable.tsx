import { Space, Table, Tooltip, theme } from "antd";
import moment from "moment";
import { useCompanyData } from "../../Hooks/Companies";
import { useCustomerData } from "../../Hooks/Customers";
import { useUserData } from "../../Hooks/Users";
import { updateController } from "../../API/LayoutApi/update";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { TUpdate } from "../../types/Update/TUpdate";
import { useEffect, useState } from "react";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
// @ts-ignore
import pin from "../../assets/pinicon.png";
// @ts-ignore
import unpin from "../../assets/unpinicon.png";
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

const UpdateTable = ({
  data = [],
  isLoading,
  refetch,
}: {
  data: TUpdate[] | undefined;
  isLoading?: boolean;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TUpdate[], unknown>>;
}) => {
  const CompanyData = useCompanyData({});
  const CustomerData = useCustomerData({});
  const AdminData = useUserData({});

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

  const Row = (record: TUpdate, event: any) => {
    if (isTextSelected) {
      return;
    }
    if (event.target.classList.contains("ant-table-cell")) {
      document.location.replace(`/#/updates/${record.id}`);
    }
  };
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

  const { token } = theme.useToken();

  return (
    <div>
      <Table
        onRow={(record) => ({
          onClick: (event) => Row(record, event),
        })}
        dataSource={data?.map((u, i) => ({
          no: i + 1,
          ...u,
          company_name: CompanyData?.data?.find(
            (company: any) => company.id === u.company_id
          )?.name,
          customer_name: CustomerData?.data?.data?.find(
            (customer: any) => customer.id === u.customer_id
          )?.name,
          in_charge_name: AdminData?.data?.find(
            (admin: any) => admin.id === u.provider_id
          )?.username,
          executor_name: AdminData?.data?.find(
            (admin: any) => admin.id === u.executor_id
          )?.username,
          created: moment(u?.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD.MM.YYYY HH:mm"
          ),
          action: { ...u },
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            width: "4%",
          },
          {
            title: "Company",
            dataIndex: "company",
            ellipsis: {
              showTitle: false,
            },
            width: "10%",
            render: (text: any, record: any) => (
              <Tooltip placement="topLeft" title={text?.name}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {text?.source && (
                    <img
                      src={getImageSource(text?.source)}
                      alt=""
                      style={{ width: 20, height: 20, marginRight: 10 }}
                    />
                  )}
                  {text?.name}
                </div>
              </Tooltip>
            ),
          },
          {
            title: "Driver",
            dataIndex: "customer",
            ellipsis: {
              showTitle: false,
            },
            width: "10%",
            render: (item: { name: string }) => (
              <Tooltip placement="topLeft" title={item?.name}>
                {item?.name}
              </Tooltip>
            ),
          },
          {
            title: "Created by",
            dataIndex: "provider ",
            ellipsis: {
              showTitle: false,
            },
            responsive: ["xl"],
            width: "10%",
            render: (note: string) => (
              <Tooltip placement="topLeft" title={note}>
                {note}
              </Tooltip>
            ),
          },
          {
            title: "Completed by",
            dataIndex: "executor",
            ellipsis: {
              showTitle: false,
            },
            responsive: ["lg"],
            width: "10%",
            render: (note: string) => (
              <Tooltip placement="topLeft" title={note}>
                {note}
              </Tooltip>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            ellipsis: {
              showTitle: false,
            },
            width: "10%",
            render: (status: string) => (
              <span>
                {status === "Done" && <p className="status-done">Done</p>}
                {status === "Checking" && (
                  <p className="status-in-progress">Checking</p>
                )}
                {status === "New" && <p className="status-new">New</p>}
                {status === "Setup" && <p className="status-new">Setup</p>}
                {status === "Paper" && <p className="status-new">Paper</p>}
              </span>
            ),
          },
          {
            title: "Note",
            dataIndex: "note",
            width: "10%",
            ellipsis: {
              showTitle: false,
            },
            render: (note: string) => (
              <Tooltip placement="topLeft" title={note}>
                {note}
              </Tooltip>
            ),
          },
          {
            title: "Solution",
            dataIndex: "solution",
            width: "10%",
            responsive: ["lg"],
            ellipsis: {
              showTitle: false,
            },
            render: (note: string) => (
              <Tooltip placement="topLeft" title={note}>
                {note}
              </Tooltip>
            ),
          },
          {
            title: "Created at",
            dataIndex: "created",
            ellipsis: {
              showTitle: false,
            },
            responsive: ["xxl"],
            width: "10%",
            render: (note: string) => (
              <Tooltip placement="topLeft" title={note}>
                {note}
              </Tooltip>
            ),
          },
          {
            title: "Actions",
            dataIndex: "action",
            width: "8%",
            render: (record: TUpdate) => {
              return (
                <div className="notedit">
                  {record.status !== "Done" && (
                    <Space>
                      {record.is_pinned ? (
                        <button
                          className="btn-unpin"
                          onClick={(e) => {
                            const updateData = {
                              is_pinned: false,
                            };
                            updateController
                              .updatePatch(updateData, record.id)
                              .then(() => {
                                refetch();
                              });
                          }}
                        >
                          <img src={unpin} alt="" />
                        </button>
                      ) : (
                        <button
                          className="btn-pin"
                          style={{ paddingTop: 2 }}
                          onClick={(e) => {
                            const updateData = {
                              is_pinned: true,
                            };
                            updateController
                              .updatePatch(updateData, record.id)
                              .then(() => {
                                refetch();
                              });
                          }}
                        >
                          <img src={pin} alt="" />
                        </button>
                      )}
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
        loading={isLoading}
        size="small"
        scroll={{ x: "768px" }}
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

export default UpdateTable;
