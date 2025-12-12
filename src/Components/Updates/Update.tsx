import { useCallback, useEffect, useRef, useState } from "react";
import AddUpdate from "./AddUpdate";
import { Button, Input, Select, Space, Typography, theme } from "antd";
import {
  LeftOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import UpdateTable from "./UpdateTable";
import { useUpdateData } from "../../Hooks/Update";
import { useCompanyData } from "../../Hooks/Companies";
import { debounce } from "lodash";
const { Option } = Select;

const Update = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<any>([
    "New",
    "In Progress",
    "Paper",
    "Setup",
  ]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem("general_pageSize");
    return saved ? Number(saved) : 15;
  });
  const [companyName, setCompanyName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");

  const pageSizeOptions = [15, 20, 30, 40, 50];
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const { data, refetch, isLoading } = useUpdateData(
    status,
    page,
    pageSize,
    company,
    driverName
  );

  const companyData = useCompanyData({
    name: companyName,
  });

  const debouncedSearch = useCallback(
    debounce((val: string, setCompany, setCompanyName) => {
      if (val === "") {
        setCompany("");
      }
      setCompanyName(val);
    }, 500),
    []
  );

  const handleSelectChange = useCallback(
    debounce((value) => {
      setStatus(value);
    }, 1000),
    []
  );

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setDriverName(value);
    }, 1000),
    []
  );

  const showModal = () => {
    setOpen(true);
  };

  const { token } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("general_pageSize", String(pageSize));
  }, [pageSize]);

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

  return (
    <div>
      {open && <AddUpdate refetch={refetch} open={open} setOpen={setOpen} />}
      <div className="header d-flex" style={{ marginBottom: 16 }}>
        <Typography className="title">Updates</Typography>
        <div className="d-flex">
          <Button
            style={{
              marginRight: 10,
              backgroundColor: "#f99e2c",
              color: "white",
              padding: 18,
            }}
            className="d-flex"
            onClick={showModal}
            icon={<PlusOutlined />}
          >
            Add
          </Button>
          <Button
            className="d-flex"
            style={{
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              padding: 18,
            }}
            onClick={() => {
              refetch();
            }}
            icon={<ReloadOutlined />}
          >
            Refresh
          </Button>
        </div>
      </div>
      <div className="filter d-flex" style={{ gap: 5 }}>
        <Select
          style={{ width: 260, marginLeft: 10 }}
          placeholder="Status"
          onChange={handleSelectChange}
          mode="multiple"
          defaultValue={[]}
        >
          <Option value="New">New</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
          <Option value="Paper">Paper</Option>
          <Option value="Setup">Setup</Option>
          <Option value="Archived">Archived</Option>
        </Select>

        <Select
          style={{ width: 260, marginLeft: 10 }}
          showSearch
          placeholder="Search Company"
          onSearch={(value) =>
            debouncedSearch(value, setCompany, setCompanyName)
          }
          options={companyData?.data?.map((item) => ({
            label: item?.name,
            value: item?.name,
          }))}
          filterOption={false}
          allowClear
          onChange={(v) => setCompany(v)}
        />

        <Input
          style={{ width: 260, marginLeft: 10 }}
          placeholder="Search Driver Name"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <UpdateTable data={data?.data} refetch={refetch} isLoading={isLoading} />
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
              cursor: "pointer",
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

export default Update;
