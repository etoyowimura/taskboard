import { Table, Tooltip } from "antd";
import React from "react";
import tagIcon from "../../assets/tagIcon.png";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { theme } from "antd";
import { useAccountingData } from "../../Hooks/Accounting";

const AccountingCurrent: React.FC = () => {
  const { data, refetch, isLoading } = useAccountingData({
    month: "current",
  });

  const { token } = theme.useToken();

  return (
    <div>
      <Table
        size="small"
        loading={isLoading}
        dataSource={data?.map((u, i) => ({
          no: i + 1,
          ...u,
        }))}
        columns={[
          {
            title: <img src={tagIcon} alt="" />,
            dataIndex: "no",
            key: "no",
            width: "5%",
          },
          {
            title: "Username",
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Tasks",
            dataIndex: "number_of_tasks",
            key: "number_of_tasks",
          },
          {
            title: "Points",
            dataIndex: "total_points",
            key: "total_points",
          },
          {
            title: "Salary Type",
            dataIndex: "salary_type",
            render: (value: any, record: any) => {
              if (record.salary_type === "task_based") {
                return <p>Task Based</p>;
              } else if (record.salary_type === "hybrid") {
                return <p>Hybrid</p>;
              } else {
                return <p>{record.salary_type}</p>; // Agar boshqa qiymat bo'lsa, oddiy qilib chiqariladi
              }
            },
            filters: [
              {
                text: "Hybrid",
                value: "hybrid",
              },
              {
                text: "Task Based",
                value: "task_based",
              },
            ],
            filterMultiple: false,
            // defaultFilteredValue: ["hybrid"],
            onFilter: (value: any, record: any) => {
              return record.salary_type === value;
            },
          },
          {
            title: "Base Salary",
            dataIndex: "salary_base_amount",
            render: (text: string, record: any) => (
              <p>${record?.salary_base_amount}</p>
            ),
          },
          {
            title: "Performance Salary",
            dataIndex: "performance_salary",
            render: (text: string, record: any) => (
              <p>${record?.performance_salary}</p>
            ),
          },
          {
            title: "Charges",
            dataIndex: "total_charges",
            render: (text: string, record: any) => (
              <p>${record?.total_charges}</p>
            ),
          },
          {
            title: "Bonuses",
            dataIndex: "total_bonuses",
            render: (text: string, record: any) => (
              <p>${record?.total_bonuses}</p>
            ),
          },
          {
            title: (
              <div>
                <span>Salary</span> &nbsp;
                <Tooltip title="The calculation of salary begins at the start of the month and continues to the current day. Select a month to review salary details for prior periods.">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            ),
            dataIndex: "salary",
            key: "salary",
            render: (text: string, record: any) => (
              <Tooltip
                title={
                  <div>
                    {record.salary_type === "hybrid" ? (
                      <p>
                        <strong>Fixed Amount:</strong> $
                        {record.salary_base_amount}
                      </p>
                    ) : (
                      ""
                    )}
                    <p>
                      <strong>Performance based amount:</strong> $
                      {record.performance_based_amount}
                    </p>
                  </div>
                }
                overlayStyle={{
                  maxWidth: "700px",
                }}
              >
                <span>${record.salary}</span>
              </Tooltip>
            ),
            // sorter: (a: any, b: any) => a.salary - b.total_points,
            // sortDirections: ["ascend", "descend"],
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        bordered
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
          showLessItems: true,
        }}

        // onRow={(record) => ({
        //   onClick: () => {
        //     if (record.user && record.user.id) {
        //       navigate(`/accounting/${record.user.id}`); // `user.id`ni olish
        //     } else {
        //       console.error("User ID mavjud emas");
        //     }
        //   },
        // })}
      />
    </div>
  );
};

export default AccountingCurrent;
