import {
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";

import tagIcon from "../../assets/tagIcon.svg";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EllipsisOutlined,
  LeftOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { theme } from "antd";
import { useAccountingData } from "../../Hooks/Accounting";
import moment from "moment";
import api from "../../API/api";
import { useTeamData } from "../../Hooks/Teams";
import { useRoleData } from "../../Hooks/Role";

type Employee = {
  id: number;
  full_name: string;
  username: string;
};

type BonusData = {
  employee: Employee;
  charges: any[];
  total: number;
};

interface BonusesTableProps {
  bonusesData: BonusData[];
}

const AccountingCurrent: React.FC = () => {
  dayjs.extend(localizedFormat);
  const themes = localStorage.getItem("theme") === "true" ? true : false;

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const currentInfo = new Date().toLocaleString("default", { month: "long" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pageSizeOptions = [10, 20, 30, 40, 50];

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const Next = () => {
    const a = Number(page) + 1;
    setPage(a);
  };
  const Previos = () => {
    Number(page);
    if (page > 1) {
      const a = Number(page) - 1;
      setPage(a);
    }
  };

  const { Option } = Select;

  // const currentMonth = moment().month();
  // const currentYear = moment().year();
  // const today = moment().endOf("day");

  const currentMonth = dayjs().month(); // Hozirgi oy
  const currentYear = dayjs().year(); // Hozirgi yil
  const today = dayjs().endOf("day");

  // const date = dayjs(new Date()); // new Date() ni dayjs bilan o'rnating
  // const formattedDate = date.locale("en").format("YYYY-MM-DD");

  const disabledDate = (current: dayjs.Dayjs) => {
    return (
      current &&
      (current.month() !== currentMonth ||
        current.year() !== currentYear ||
        current.isAfter(today))
    );
  };

  const [selectedUserId, setSelectedUserId] = useState(null);
  // const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const [form] = Form.useForm();

  const [isBonusModalVisible, setIsBonusModalVisible] = useState(false);
  const [isChargeModalVisible, setIsChargeModalVisible] = useState(false);

  const [bonusesData, setBonusesData] = useState<BonusesTableProps[]>([]);
  const [chargesData, setChargesData] = useState([]);

  const [search, setSearch] = useState<string>("");
  const [team, setTeam] = useState<any>("");
  const [role, setRole] = useState<any>("");
  const [salaryType, setSalaryType] = useState<any>("");

  const showBonusModal = (userId: any) => {
    setSelectedUserId(userId); // Tanlangan user_id ni saqlash
    setIsBonusModalVisible(true);
  };

  const showChargeModal = (userId: any) => {
    setIsChargeModalVisible(true);
    setSelectedUserId(userId);
  };

  const handleCancel = () => {
    setIsBonusModalVisible(false);
    setIsChargeModalVisible(false);
  };

  const { data, refetch, isLoading } = useAccountingData({
    month: "current",
    search: search,
    team: team,
    page: page,
    page_size: pageSize,
    role: role,
    salary_type: salaryType,
  });

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    form.setFieldsValue({ date });
  };

  const handleOkCharge = () => {
    form
      .validateFields()
      .then((values) => {
        const { date, amount, notes } = values;

        const formattedDate = selectedDate
          ? selectedDate.format("YYYY-MM-DD")
          : null;

        if (selectedUserId) {
          api
            .post(`/add-charge/${selectedUserId}/`, {
              date: formattedDate,
              amount: amount,
              reason: notes,
            })
            .then((response) => {
              message.success(response.data.message);
              setIsChargeModalVisible(false);
              form.resetFields();
              refetch();
            })
            .catch((error) => {
              console.error("API error:", error);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const handleOkBonus = () => {
    form
      .validateFields()
      .then((values) => {
        const { date, amount, notes } = values;

        const formattedDate = selectedDate
          ? selectedDate.format("YYYY-MM-DD")
          : null;

        if (selectedUserId) {
          api
            .post(`/add-bonus/${selectedUserId}/`, {
              date: formattedDate,
              amount: amount,
              reason: notes,
            })
            .then((response) => {
              message.success(response.data.message);
              setIsBonusModalVisible(false);
              form.resetFields();
              refetch();
            })
            .catch((error) => {
              console.error("API error:", error);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const menu = (userId: any) => (
    <Menu>
      <Menu.Item key="1" onClick={() => showBonusModal(userId)}>
        <PlusOutlined /> Add Bonus
      </Menu.Item>
      <Menu.Item key="2" onClick={() => showChargeModal(userId)}>
        <PlusOutlined /> Add Charge
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (isBonusModalVisible || isChargeModalVisible) {
      setOpen(false);
    }
  }, [isBonusModalVisible, isChargeModalVisible]);

  const handleRowClick = (record: any, e: React.MouseEvent<HTMLElement>) => {
    setSelectedUser(record);

    const target = e.target as HTMLElement;

    const employee_id = record.employee_id;
    const apiUrl = `/bonuses/${employee_id}`;
    const chargeUrl = `/charges/${employee_id}`;

    const params = {
      month: "current",
    };

    api
      .get(apiUrl, { params })
      .then((response) => {
        const formattedData = response.data?.bonuses?.map(
          (bonus: any, index: any) => ({
            no: index + 1,
            id: bonus.id,
            date: bonus.date,
            amount: bonus.amount,
            reason: bonus.reason || "",
            username: response.data.employee.username,
            total: response.data.total,
          })
        );

        setBonusesData(formattedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    api
      .get(chargeUrl, { params })
      .then((response) => {
        const formattedData = response.data.charges.map(
          (charges: any, index: any) => ({
            no: index + 1,
            id: charges.id,
            date: charges.date,
            amount: charges.amount,
            reason: charges.reason || "",
            username: response.data.employee.username,
            total: response.data.total,
          })
        );

        setChargesData(formattedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (!target.closest(".ant-dropdown-trigger")) {
      setOpen(true);
    }
  };

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditBonusModalVisible, setIsEditBonusModalVisible] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<{ id?: string } | null>(
    null
  );
  const [selectedRecordBonus, setSelectedRecordBonus] = useState<{
    id?: string;
  } | null>(null);

  const showModalBonusEdit = (record: any) => {
    if (!record || typeof record !== "object") {
      console.error("Invalid record:", record);
      return;
    }

    const { date, ...fieldsWithoutDate } = record;

    setSelectedRecordBonus(record);
    form.setFieldsValue(fieldsWithoutDate);
    setIsEditBonusModalVisible(true);
  };
  const showModal = (record: any) => {
    if (!record || typeof record !== "object") {
      console.error("Invalid record:", record);
      return;
    }

    const { date, ...fieldsWithoutDate } = record;

    setSelectedRecord(record);
    form.setFieldsValue(fieldsWithoutDate);

    setIsEditModalVisible(true);
  };

  const Cancel = () => {
    setIsEditModalVisible(false);
    setIsEditBonusModalVisible(false);
    form.resetFields();
  };

  const handleOkBonusEdit = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedRecordBonus) {
        throw new Error("No record selected!");
      }

      const updatedData = {
        amount: values.amount,
        reason: values.reason,
      };

      const response = await api.put(
        `bonus/${selectedRecordBonus.id}/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 202) {
        setBonusesData((prevData: any) =>
          prevData.map((item: any) =>
            item.id === selectedRecordBonus.id
              ? { ...item, ...updatedData }
              : item
          )
        );
        refetch();

        setIsEditBonusModalVisible(false);
      } else {
        throw new Error("Server Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleOk = async () => {
  //   try {
  //     const values = await form.validateFields();

  //     if (!selectedRecord) {
  //       throw new Error("No record selected!");
  //     }

  //     const updatedData = {
  //       ...(selectedRecord || {}),
  //       ...values,
  //     };

  //     const response = await api.put(
  //       `charge/${selectedRecord.id}/`,
  //       updatedData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 202) {
  //       setChargesData((prevData: any) =>
  //         prevData.map((item: any) =>
  //           item.id === selectedRecord.id ? { ...item, ...updatedData } : item
  //         )
  //       );
  //       refetch();

  //       setIsEditModalVisible(false);
  //     } else {
  //       throw new Error("Server Error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedRecord) {
        throw new Error("No record selected!");
      }

      // Faqat kerakli maydonlarni olish (masalan, `amount` va `reason`)
      const updatedData = {
        amount: values.amount,
        reason: values.reason,
      };

      const response = await api.put(
        `charge/${selectedRecord.id}/`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 202) {
        setChargesData((prevData: any) =>
          prevData.map((item: any) =>
            item.id === selectedRecord.id ? { ...item, ...updatedData } : item
          )
        );
        refetch();

        setIsEditModalVisible(false);
      } else {
        throw new Error("Server Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    teamData?.data?.map((item: any) => ({
      label: item?.name,
      value: item?.name,
    }));

  const roleData = useRoleData();

  const roleOptions: { label: string; value: any }[] | undefined =
    roleData?.data?.map((item: any) => ({
      label: item?.name,
      value: item?.id,
    }));

  const salaryTypeOptions = [
    { label: "Hybrid", value: "hybrid" },
    { label: "Task Based", value: "task_based" },
    { label: "Fixed", value: "fixed" },
  ];

  const deleteFunctionBonus = (record: any) => {
    const { id } = record;

    const apiUrl = `/bonus/${id}`;

    api
      .delete(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          setBonusesData((prevData: any) => {
            const updatedData = prevData.filter((item: any) => item.id !== id);
            return updatedData;
          });
          message.success(response.data.message);
        }
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const deleteFunctionCharge = (record: any) => {
    const { id } = record;

    const apiUrl = `/charge/${id}`;

    api
      .delete(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          setChargesData((prevData: any) => {
            const updatedData = prevData.filter((item: any) => item.id !== id);
            return updatedData;
          });
          message.success(response.data.message);
        }
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div>
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
          allowClear
        />
        <Select
          style={{ width: 260 }}
          placeholder="Role"
          onChange={(value: any) => setRole(value)}
          options={roleOptions}
          allowClear
        />
        <Select
          style={{ width: 260 }}
          placeholder="Salary Type"
          onChange={(value: string) => setSalaryType(value)}
          options={salaryTypeOptions}
          allowClear
        />
      </span>
      <Table
        size="small"
        loading={isLoading}
        dataSource={data?.data?.map((u: any, i: any) => ({
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
          },
          {
            title: "Team",
            dataIndex: "team_name",
            key: "team_name",
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
              } else if (record.salary_type === "fixed") {
                return <p>Fixed</p>;
              } else {
                return <p>{record.salary_type}</p>;
              }
            },
          },
          {
            title: "Base Salary",
            dataIndex: "salary_base_amount",
            sorter: (a: any, b: any) =>
              a.salary_base_amount - b.salary_base_amount,
            render: (text: string, record: any) => (
              <p>${record?.salary_base_amount}</p>
            ),
          },
          {
            title: "Performance Salary",
            dataIndex: "performance_salary",
            sorter: (a: any, b: any) =>
              a.performance_salary - b.performance_salary,
            render: (text: string, record: any) => (
              <p>${record?.performance_salary}</p>
            ),
          },
          {
            title: "Charges",
            dataIndex: "total_charges",
            sorter: (a: any, b: any) => a.total_charges - b.total_charges,

            render: (text: string, record: any) => (
              <p>${record?.total_charges}</p>
            ),
          },
          {
            title: "Bonuses",
            dataIndex: "total_bonuses",
            sorter: (a: any, b: any) => a.total_bonuses - b.total_bonuses,
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
            sorter: (a: any, b: any) => a.salary - b.salary,
            render: (text: string, record: any) => (
              <span>${record.salary}</span>
            ),
          },
          {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: any) => (
              <Dropdown overlay={menu(record.employee_id)} trigger={["click"]}>
                <Button
                  icon={<EllipsisOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            ),
          },
        ]}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "odd-row" : "even-row"
        }
        bordered
        // pagination={{
        //   pageSize: 10,
        //   size: "default",
        //   style: {
        //     margin: 0,
        //     justifyContent: "end",
        //     position: "fixed",
        //     bottom: 0,
        //     left: 0,
        //     width: "100%",
        //     backgroundColor: token.colorBgContainer,
        //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
        //     padding: "10px 0",
        //     zIndex: 1000,
        //   },
        //   showLessItems: true,
        // }}
        pagination={false}
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
                  <p className={!themes ? "sub" : "sub-dark"}>Tasks</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.number_of_tasks}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Points</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {selectedUser?.total_points}
                  </p>
                </tr>
              </div>

              <div>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Current month</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    {currentInfo}
                  </p>
                </tr>

                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Bonus</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    ${selectedUser?.total_bonuses}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Charge</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    ${selectedUser?.total_charges}
                  </p>
                </tr>
                <tr>
                  <p className={!themes ? "sub" : "sub-dark"}>Salary</p>
                  <p className={!themes ? "info" : "info-dark"}>
                    ${selectedUser?.salary}
                  </p>
                </tr>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 25,
            marginTop: 25,
          }}
        >
          <div style={{ width: "50%" }}>
            <Typography
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Bonuses
            </Typography>
            <Table
              bordered
              size="small"
              dataSource={bonusesData}
              columns={[
                {
                  title: <img src={tagIcon} alt="" />,
                  dataIndex: "no",
                  key: "no",
                  width: "5%",
                  align: "center",
                },
                {
                  title: "Date",
                  dataIndex: "date",
                  render: (text: string) => moment(text).format("MMMM DD"),
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  render: (text: string, record: any) => (
                    <p>${record?.amount}</p>
                  ),
                },
                {
                  title: "Action",
                  // width: "10%",
                  align: "center",
                  render: (_, record) => (
                    <>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => showModalBonusEdit(record)}
                        style={{ marginRight: 8 }} // Butonlar orasida masofa qo'shish
                      />
                      <Button
                        style={{
                          color: "red",
                          borderColor: "red", // Butonning chegarasini qizil qilish
                        }}
                        icon={<DeleteOutlined />}
                        onClick={() => deleteFunctionBonus(record)}
                      />
                    </>
                  ),
                },
              ]}
            />
          </div>

          <div style={{ width: "50%" }}>
            <Typography
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Charges
            </Typography>
            <Table
              size="small"
              bordered
              dataSource={chargesData}
              columns={[
                {
                  title: <img src={tagIcon} alt="" />,
                  dataIndex: "no",
                  key: "no",
                  width: "5%",
                  align: "center",
                },
                {
                  title: "Date",
                  dataIndex: "date",
                  render: (text: string) => moment(text).format("MMMM DD"),
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  render: (text: string, record: any) => (
                    <p>${record?.amount}</p>
                  ),
                },
                {
                  title: "Action",
                  // width: "5%",
                  align: "center",
                  render: (_, record) => (
                    <>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                        style={{ marginRight: 8 }}
                      />
                      <Button
                        style={{
                          color: "red",
                          borderColor: "red", // Butonning chegarasini qizil qilish
                        }}
                        icon={<DeleteOutlined />}
                        onClick={() => deleteFunctionCharge(record)}
                      />
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Drawer>

      <Modal
        title="Add Bonus"
        visible={isBonusModalVisible}
        onCancel={handleCancel}
        onOk={handleOkBonus}
        maskClosable={false}
        okText={
          <span>
            <PlusOutlined style={{ marginRight: 4 }} />
            Add
          </span>
        }
        cancelText={
          <span>
            <CloseOutlined style={{ marginRight: 4 }} />
            Cancel
          </span>
        }
        // footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              format="YYYY MMMM DD"
              onChange={handleDateChange}
              value={selectedDate ? selectedDate : null}
            />
          </Form.Item>

          {/* Amount Input */}
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter an amount!" }]}
          >
            <Input
              prefix={<DollarOutlined />}
              type="number"
              style={{ width: "100%" }}
              placeholder="0"
              onKeyPress={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          {/* Textarea */}
          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter notes here" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Charge Modal */}
      <Modal
        title="Add Charge"
        visible={isChargeModalVisible}
        onCancel={handleCancel}
        maskClosable={false}
        onOk={handleOkCharge}
        okText={
          <span>
            <PlusOutlined style={{ marginRight: 4 }} />
            Add
          </span>
        }
        cancelText={
          <span>
            <CloseOutlined style={{ marginRight: 4 }} />
            Cancel
          </span>
        }
      >
        <Form form={form} layout="vertical">
          {/* Date Picker */}
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              format="YYYY MMMM DD"
              onChange={handleDateChange}
              value={selectedDate ? selectedDate : null}
            />
          </Form.Item>

          {/* Amount Input */}
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter an amount!" }]}
          >
            <Input
              prefix={<DollarOutlined />}
              type="number"
              style={{ width: "100%" }}
              placeholder="0"
              onKeyPress={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          {/* Textarea */}
          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter notes here" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT CHARGE  MODAL */}

      <Modal
        title="Edit Charge"
        visible={isEditModalVisible}
        onCancel={Cancel}
        onOk={handleOk}
        maskClosable={false}
        okText={
          <span>
            <CheckOutlined style={{ marginRight: 4 }} />
            Save
          </span>
        }
        cancelText={
          <span>
            <CloseOutlined style={{ marginRight: 4 }} />
            Cancel
          </span>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter an amount!" }]}
          >
            <Input
              prefix={<DollarOutlined />}
              type="number"
              style={{ width: "100%" }}
              placeholder="0"
              onKeyPress={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          {/* Textarea */}
          <Form.Item name="reason" label="Notes">
            <Input.TextArea placeholder="Enter notes here" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT Bonus  MODAL */}

      <Modal
        title="Edit Bonus"
        visible={isEditBonusModalVisible}
        onCancel={Cancel}
        onOk={handleOkBonusEdit}
        maskClosable={false}
        okText={
          <span>
            <CheckOutlined style={{ marginRight: 4 }} />
            Save
          </span>
        }
        cancelText={
          <span>
            <CloseOutlined style={{ marginRight: 4 }} />
            Cancel
          </span>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter an amount!" }]}
          >
            <Input
              prefix={<DollarOutlined />}
              type="number"
              style={{ width: "100%" }}
              placeholder="0"
              onKeyPress={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item name="reason" label="Notes">
            <Input.TextArea placeholder="Enter notes here" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Space style={{ width: "100%", marginTop: 40 }} direction="vertical">
        <Space
          style={{
            justifyContent: "end",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: token.colorBgContainer,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            padding: "10px 0",
            zIndex: 1000,
          }}
          wrap
        >
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: 65, marginRight: 16 }}
            options={pageSizeOptions.map((size) => ({
              label: `${size}`,
              value: size,
            }))}
          />

          <Button
            onClick={Previos}
            disabled={data?.previous ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <LeftOutlined />
          </Button>
          <Input
            disabled
            style={{
              width: 40,
              textAlign: "center",
              background: token.colorBgContainer,
              border: "1px solid",
              borderColor: token.colorText,
              color: token.colorText,
            }}
            value={page}
            onChange={(e) => {
              let num = e.target.value;
              if (Number(num) && num !== "0") {
                setPage(Number(num));
              }
            }}
          />
          <Button
            onClick={Next}
            disabled={data?.next ? false : true}
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              border: "none",
            }}
          >
            <RightOutlined />
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default AccountingCurrent;
