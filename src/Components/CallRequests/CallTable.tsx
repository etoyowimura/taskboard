import { Button, Input, Modal, Space, Table, theme } from "antd";
import { TCall } from "../../types/CallRequests/TCall";
import { EditOutlined } from "@ant-design/icons";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import moment from "moment";
import { callController } from "../../API/LayoutApi/callrequests";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { useState } from "react";
import { TPagination } from "../../types/common/TPagination";
import useToken from "antd/es/theme/useToken";
const CallTable = ({
  data,
  isLoading,
  refetch,
}: {
  data: TCall[] | undefined;
  isLoading: boolean;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TPagination<TCall[]>, unknown>>;
}) => {
  const statusClick = (record: TCall | any) => {
    callController
      .callPatch({ note: undefined, status: "Resolved" }, record.id)
      .then(() => {
        refetch();
      });
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [id, setId] = useState<number>();
  const addNote = (a: any) => {
    setModalVisible(true);
    setId(a.id);
  };

  const handleOk = () => {
    if (id) {
      callController
        .callPatch({ note: note, status: undefined }, id)
        .then(() => {
          refetch();
          setNote("");
        });
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const { token } = theme.useToken();

  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={data?.map((u, i) => ({
          ...u,
          no: i + 1,
          id: u?.id,
          company: u?.company?.name,
          driver: u?.driver?.name,
          time: moment(u?.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD.MM.YYYY HH:mm"
          ),
          action: u,
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            width: "5%",
          },
          {
            title: "Company",
            dataIndex: "company",
            // width: "20%",
          },
          {
            title: "Driver",
            dataIndex: "driver",
            // width: "20%",
          },
          {
            title: "Note",
            dataIndex: "note",
            // width: "15%",
          },
          {
            title: "Requested at",
            dataIndex: "time",
            // width: "15%",
          },
          {
            title: "Actions",
            dataIndex: "action",
            // width: "100px",
            render: (text, record) => {
              return (
                <div>
                  {record.status !== "Resolved" && (
                    <Button type="primary" onClick={() => statusClick(record)}>
                      Resolve
                    </Button>
                  )}
                  <Button
                    style={{ marginLeft: 16 }}
                    type="primary"
                    onClick={(e) => addNote(record)}
                  >
                    <EditOutlined />
                  </Button>
                  <Modal
                    title="Add note"
                    open={modalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <Input value={note} onChange={(e) => handleNoteChange(e)} />
                  </Modal>
                </div>
              );
            },
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
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

export default CallTable;
