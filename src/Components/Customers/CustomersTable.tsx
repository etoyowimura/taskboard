import { Table, Tooltip } from "antd";
import { useCompanyData } from "../../Hooks/Companies";
import { TCustomer } from "../../types/Customer/TCustomer";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
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
import { role } from "../../App";

function CustomerTable({
  data,
  isLoading,
}: {
  data?: TCustomer[] | undefined;
  isLoading?: boolean;
}) {
  type RowProps = {
    id: number;
  };

  const Row = (record: RowProps) => {
    return {
      onClick: () => {
        role !== "Checker" &&
          document.location.replace(`/#/customers/${record.id}`);
      },
    };
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
  return (
    <div>
      <Table
        onRow={(record) => Row(record)}
        loading={isLoading}
        dataSource={data?.map((u, i) => ({
          ...u,
          no: i + 1,
          company: u?.company,
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            width: "5%",
          },
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Company",
            dataIndex: "company",
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
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        size="middle"
        bordered
        pagination={{
          pageSize: 10,
          size: "default",
        }}
        scroll={{ x: "768px" }}
      />
    </div>
  );
}

export default CustomerTable;
