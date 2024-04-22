import { Table } from "antd";
import { useCompanyData } from "../../Hooks/Companies";
import { TCustomer } from "../../types/Customer/TCustomer";
// @ts-ignore
import tagIcon from "../../assets/tagIcon.png";
import { role } from "../../App";

function CustomerTable({
  data,
  isLoading,
}: {
  data?: TCustomer[] | undefined;
  isLoading?: boolean;
}) {
  const CompanyData = useCompanyData({
    name: undefined,
    page: undefined,
    is_active: undefined,
  });

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
  return (
    <div>
      <Table
        onRow={(record) => Row(record)}
        loading={isLoading}
        dataSource={data?.map((u, i) => ({
          ...u,
          no: i + 1,
          company_id:
            CompanyData?.data?.find(
              (company: any) => company.id === u?.company_id
            )?.name || "",
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
            dataIndex: "company_id",
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
      />
    </div>
  );
}

export default CustomerTable;
