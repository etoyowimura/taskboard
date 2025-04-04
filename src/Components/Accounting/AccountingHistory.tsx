import {
  Button,
  Drawer,
  Input,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import tagIcon from "../../assets/tagIcon.svg";
import {
  CloseOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { theme } from "antd";
import api from "../../API/api";
import { useAccountingHistory } from "../../Hooks/Accounting";
import { useTeamData } from "../../Hooks/Teams";

const { Title } = Typography;

interface Salary {
  id: number;
  month: string;
  year: number;
  number_of_tasks: number;
  total_points: number;
  salary_type: string;
  base_salary: string;
  performance_salary: string;
  total_salary: string;
  salary_document_path: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

interface SalaryData {
  employee: Employee;
  salaries: Salary[];
  total: number;
}

const AccountingHistory: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState<SalaryData | null>(null);

  const [years, setYears] = useState<number[]>([]);

  const [search, setSearch] = useState<string>("");
  const [team, setTeam] = useState<any>("");

  const themes = localStorage.getItem("theme") === "true" ? true : false;
  const { data, refetch, isLoading } = useAccountingHistory({
    search: search,
    team: team,
  });

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleRowClick = async (record: any, e: any) => {
    setSelectedUser(record);
    setOpen(true);

    const id = record.id;

    try {
      const response = await api.get(`/employee-salaries/${id}/`);
      setUserData(response.data);

      const newYears = Array.from(
        new Set(response.data.salaries.map((salary: Salary) => salary.year))
      ).map((year) => Number(year));
      setYears(newYears);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Loading holatini o'chirish
    }
  };

  useEffect(() => {
    if (userData && userData.salaries && userData.salaries.length > 0) {
      const newYears = Array.from(
        new Set(userData.salaries.map((salary: Salary) => Number(salary.year)))
      ).sort((a, b) => b - a);

      setYears(newYears);
    }
  }, [userData]);

  const { token } = theme.useToken();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const searchText = e.target.value;
    timerRef.current = setTimeout(() => {
      setSearch(searchText);
    }, 1000);
  };

  const teamData = useTeamData({});
  const teamOptions: { label: string; value: any }[] | undefined =
    teamData?.data?.map((item) => ({
      label: item?.name,
      value: item?.name,
    }));
  const additionalOption = {
    label: "all",
    value: "",
  };
  if (teamOptions) {
    teamOptions.unshift(additionalOption);
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ marginRight: 12 }}>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={handleSearchChange}
          />
        </div>
        <Select
          style={{ width: 260 }}
          placeholder="Team"
          onChange={(value: any) => setTeam(value)}
          options={teamOptions}
        />
      </span>
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
            align: "center",
          },
          {
            title: "Username",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text, record) => (
              <Tooltip
                title={
                  record?.full_name?.trim()
                    ? record.full_name
                    : "User does not have a name"
                }
              >
                <span>{text}</span>
              </Tooltip>
            ),
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: [
              {
                text: "Tech Support",
                value: "Tech Support",
              },
              {
                text: "Checker",
                value: "Checker",
              },
              {
                text: "Accountant",
                value: "Accountant",
              },
            ],
            filterMultiple: false,
            onFilter: (value: any, record: any) => {
              return record.role === value;
            },
          },
          {
            title: "Team",
            dataIndex: "team_name",
            key: "team_name",
          },
          {
            title: "Total Tasks",
            dataIndex: "total_number_of_tasks",
            key: "total_number_of_tasks",
          },
          {
            title: "Total Points",
            dataIndex: "total_earned_points",
            key: "total_earned_points",
          },
          {
            title: (
              <Tooltip title="Total Worked Months">
                <span>TWM</span>&nbsp;
                <QuestionCircleOutlined />
              </Tooltip>
            ),
            dataIndex: "salary_months_count",
            key: "salary_months_count",

            // render: (salary_months_count) => {
            //   const years = Math.floor(salary_months_count / 12);
            //   const remainingMonths = salary_months_count % 12;

            //   let result = "";
            //   if (years > 0) {
            //     result += `${years} year${years > 1 ? "s" : ""}`;
            //   }
            //   if (remainingMonths > 0) {
            //     result += `${years > 0 ? " " : ""}${remainingMonths} month${
            //       remainingMonths > 1 ? "s" : ""
            //     }`;
            //   }
            //   return result || "0 months";
            // },
          },
          {
            title: "Salary Type",
            dataIndex: "salary_type",
            render: (value: any, record: any) => {
              if (record.salary_type === "task_based") {
                return <p>Task Based</p>;
              } else if (record.salary_type === "hybrid") {
                return <p>Hybrid</p>;
              } else if (record.salary_type === "fixed") {
                return <p>Fixed</p>;
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
              {
                text: "Fixed",
                value: "fixed",
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
            dataIndex: "total_base_salary",
            sorter: (a: any, b: any) =>
              a.total_base_salary - b.total_base_salary,
            render: (text: string, record: any) => (
              <p>${record?.total_base_salary}</p>
            ),
          },
          {
            title: "Performance Salary",
            dataIndex: "total_performance_salary",
            sorter: (a: any, b: any) =>
              a.total_performance_salary - b.total_performance_salary,
            render: (text: string, record: any) => (
              <p>${record?.total_performance_salary}</p>
            ),
          },
          {
            title: "Total Charges",
            dataIndex: "total_charges",
            sorter: (a: any, b: any) => a.total_charges - b.total_charges,
            render: (text: string, record: any) => (
              <p>${record?.total_charges}</p>
            ),
          },
          {
            title: "Total Bonuses",
            dataIndex: "total_bonuses",
            sorter: (a: any, b: any) => a.total_bonuses - b.total_bonuses,
            render: (text: string, record: any) => (
              <p>${record?.total_bonuses}</p>
            ),
          },
          {
            title: "Total Salary",
            dataIndex: "total_earned_salary",
            key: "total_earned_salary",
            sorter: (a: any, b: any) =>
              a.total_earned_salary - b.total_earned_salary,
            render: (text: string, record: any) => (
              <span>${record.total_earned_salary}</span>
            ),
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

        onRow={(record) => ({
          onClick: (e) => handleRowClick(record, e),
        })}
      />
      <Drawer
        title={
          <Typography className="title">
            {selectedUser?.full_name?.trim()
              ? selectedUser.full_name
              : selectedUser?.username}
          </Typography>
        }
        placement="right"
        width={850}
        onClose={() => setOpen(false)}
        closable={false}
        open={open}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setOpen(false)}
          />
        }
      >
        <div className="info-div">
          <Typography
            style={{
              fontSize: 18,
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Information
          </Typography>
          <div className="info-body">
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <div>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Username</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.username}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Role</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.role}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Total Tasks</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.total_number_of_tasks}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Total Points</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.total_earned_points}
                  </p>
                </tr>
              </div>
              <div>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>
                    Total Worked Months
                  </p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.salary_months_count}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Total Bonus</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    $
                    {new Intl.NumberFormat("en-US").format(
                      selectedUser?.total_bonuses || 0
                    )}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Total Charge</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    $
                    {new Intl.NumberFormat("en-US").format(
                      selectedUser?.total_charges || 0
                    )}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Total Salary</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    $
                    {new Intl.NumberFormat("en-US").format(
                      selectedUser?.total_earned_salary || 0
                    )}
                  </p>
                </tr>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          {years.length === 0 ? (
            <Spin spinning={loading} />
          ) : (
            years.map((year) => (
              <div key={year} style={{ marginBottom: 32 }}>
                <Title level={3}>{year}</Title>
                {userData &&
                  userData.salaries
                    .filter((salary) => salary.year === year)
                    .map((filteredSalary) => (
                      <Table
                        loading={loading}
                        key={filteredSalary.id}
                        dataSource={[filteredSalary]}
                        columns={[
                          {
                            title: <img src={tagIcon} alt="" />,
                            dataIndex: "no",
                            width: "5%",
                            align: "center",
                            render: (text, record, index) => index + 1,
                          },
                          { title: "Year", dataIndex: "year" },
                          { title: "Month", dataIndex: "month" },

                          {
                            title: "Total Charges",
                            dataIndex: "total_charges",
                            render: (text: string, record: any) => (
                              <span>${record.total_charges}</span>
                            ),
                          },
                          {
                            title: "Total Bonus",
                            dataIndex: "total_bonuses",
                            render: (text: string, record: any) => (
                              <span>${record.total_bonuses}</span>
                            ),
                          },
                          {
                            title: "Total Salary",
                            dataIndex: "total_salary",
                            render: (text: string, record: any) => (
                              <span>${record.total_salary}</span>
                            ),
                          },
                          {
                            title: "Action",
                            dataIndex: "salary_document_path",
                            align: "center",
                            render: (text, record) => (
                              <Tooltip
                                title={
                                  record.salary_document_path
                                    ? "View Document"
                                    : "No Document"
                                }
                              >
                                <Button
                                  type="primary"
                                  icon={<EyeOutlined />}
                                  onClick={() =>
                                    record.salary_document_path &&
                                    window.open(record.salary_document_path)
                                  }
                                  disabled={!record.salary_document_path}
                                />
                              </Tooltip>
                            ),
                          },
                        ]}
                        rowKey="id"
                        pagination={false}
                        bordered
                      />
                    ))}
              </div>
            ))
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default AccountingHistory;
