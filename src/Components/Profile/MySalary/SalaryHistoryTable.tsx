import { Table, Typography } from "antd";
import { SalaryHistory } from "../../../types/Profile/TProfile";

const { Title } = Typography;

type Props = {
  year: number;
  salaries: SalaryHistory[];
};

const SalaryHistoryTable: React.FC<Props> = ({ year, salaries }) => {
  return (
    <div style={{ marginBottom: 32 }}>
      <Title
        level={3}
        style={{
          fontFamily: "Inter",
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: "24px",
          letterSpacing: "-0.36px",
        }}
      >
        {year}
      </Title>
      <Table<SalaryHistory>
        dataSource={salaries}
        rowKey="id"
        scroll={{ x: 800 }}
        locale={{ emptyText: "No data" }}
        pagination={false}
        size="large"
        columns={[
          {
            title: "#",
            dataIndex: "no",
            width: "5%",
            align: "center",
            render: (_, __, index) => index + 1,
          },
          {
            title: "Month",
            dataIndex: "month",
          },
          {
            title: "Total Salary",
            dataIndex: "total_salary",
            render: (_, record) => <span>${record.total_salary}</span>,
          },
          // {
          //   title: "Total Bonuses",
          //   dataIndex: "total_bonuses",
          //   render: (_, record) => <span>${record.total_bonuses}</span>,
          // },
          {
            title: "Total Charges",
            dataIndex: "total_charges",
            render: (_, record) => <span>${record.total_charges}</span>,
          },
          {
            title: "Total Tasks",
            dataIndex: "number_of_tasks",
          },
          {
            title: "Total Points",
            dataIndex: "total_points",
          },
        ]}
      />
    </div>
  );
};

export default SalaryHistoryTable;
