import {
  Modal,
  Form as FormAnt,
  Select,
  Upload,
  Switch,
  Button,
  Radio,
  RadioChangeEvent,
  Row,
  Col,
} from "antd";
import { taskController } from "../../API/LayoutApi/tasks";
import { useEffect, useState } from "react";
import { useServiceData } from "../../Hooks/Services";
import { UploadOutlined } from "@ant-design/icons";
import { useTeamData } from "../../Hooks/Teams";
import { useCustomerByComanyData } from "../../Hooks/Customers";
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
//@ts-ignore
import addicon from "../../assets/addiconpng.png";
//ts-ignore
import fileUpload from "../../assets/upload-file.png";

import AddCustomer from "../Customers/AddCustomer";
import AddDriver from "../Companies/AddDriver";
import TextArea from "antd/es/input/TextArea";
import { isMobile } from "../../App";
import { companyController } from "../../API/LayoutApi/companies";
import { TCompany } from "../../types/Company/TCompany";
import { customerController } from "../../API/LayoutApi/customers";
import { TCustomer } from "../../types/Customer/TCustomer";

const { Option } = Select;
const AddTask = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen(open: boolean): void;
}) => {
  const [form] = FormAnt.useForm();

  const handleCancel = () => {
    setOpen(!open);
  };
  const [fileIds, setFileIds] = useState([]);
  const [searchCompanyName, setSearchCompanyName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>();
  const [companyId, setCompanyId] = useState<number>();
  const [driverOpen, setDriverOpen] = useState(false);
  const [openDrive, setOpenDrive] = useState(false);
  const [companyData, setCompanyData] = useState<TCompany[]>();
  const [customerData, setCustomerData] = useState<TCustomer[]>();
  const ServiceData = useServiceData();
  const TeamData = useTeamData({});

  // company and driver search
  useEffect(() => {
    companyController
      .readPaginated({ name: searchCompanyName, page: 1, page_size: 3 })
      .then((data) => {
        setCompanyData(data.data);
      });
  }, [searchCompanyName]);
  // const customerData = useCustomerByComanyData(
  //   { name: customerName, page: 1, page_size: 5 },
  //   companyId
  // );
  // console.log(customerData.data);

  // team select
  useEffect(() => {
    if (companyId) {
      const selectedCompany = companyData?.find(
        (item) => item.id === companyId
      );
      form.setFieldsValue({
        assigned_to_id: selectedCompany?.team?.id || undefined,
      });
      customerController
        .customerByCompany(
          {
            name: customerName,
            page: 1,
            page_size: 5,
          },
          companyId
        )
        .then((data) => {
          setCustomerData(data.data);
        });
    }
  }, [companyId, customerName]);

  // service select
  const serviceOptions = ServiceData?.data?.map((item) => ({
    label: item?.title,
    value: item?.id,
  }));
  const sortByLabel = (a: any, b: any) => {
    if (a.label === "Shift") return -1;
    if (b.label === "Shift") return 1;
    return 0;
  };

  const noteOptions = [
    { label: "No", value: "" },
    { label: "Empty", value: "Empty" },
    { label: "Bobtail", value: "Bobtail" },
  ];
  const [note, setNote] = useState("");
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setNote(value);
  };
  const noteOptions2 = [
    { label: "No", value: "" },
    { label: "+1 soat", value: "+1 soat" },
    { label: "+3 soat", value: "+3 soat" },
  ];
  const [note2, setNote2] = useState("");
  const onChange2 = ({ target: { value } }: RadioChangeEvent) => {
    setNote2(value);
  };
  const [text, setText] = useState("");
  const changeText = (e: any) => {
    setText(e.target.value);
  };

  function handlePaste(event: any) {
    const clipboardData = event.clipboardData || window.Clipboard;
    if (clipboardData && clipboardData.items.length > 0) {
      const clipboardItem = clipboardData.items[0];
      if (clipboardItem.kind === "file") {
        const file = clipboardItem.getAsFile();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        taskController
          .addTaskFile({ files: [file] })
          .then((response) => {
            const fileId = response.id;
            setFileIds((prevFileIds): any => [...prevFileIds, fileId]);
            const updatedValues = form.getFieldsValue();
            updatedValues.attachment_ids = [
              ...updatedValues.attachment_ids,
              fileId,
            ];
            form.setFieldsValue(updatedValues);
          })
          .catch((error) => {});
      }
    }
  }

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
    <div onPaste={(event) => handlePaste(event)}>
      {openDrive && <AddCustomer open={openDrive} setOpen={setOpenDrive} />}
      <AddDriver id={companyId} open={driverOpen} setOpen={setDriverOpen} />
      <Modal
        open={open}
        width={720}
        title="Add task"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form.validateFields().then(async (values) => {
            values.attachment_ids = fileIds;
            values.note =
              (text ? text + ", " : "") +
              (note ? note + ", " : "") +
              (note2 ? note2 + ", " : "");
            form.resetFields();
            await taskController.addTaskController(values);
            setOpen(!open);
          });
        }}
      >
        <FormAnt
          form={form}
          // layout={isMobile ? "vertical" : "horizontal"}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <FormAnt.Item
                label="Company"
                name="company_id"
                rules={[{ required: true, message: "Please input company!" }]}
              >
                <Select
                  showSearch
                  placeholder="Search Company"
                  onSearch={(value: any) => setSearchCompanyName(value)}
                  options={companyData?.map((item) => ({
                    label: (
                      <div>
                        {item?.source && (
                          <img
                            style={{ width: 15, height: 20, paddingTop: 7 }}
                            src={getImageSource(item?.source)}
                            alt=""
                          />
                        )}{" "}
                        {item?.name}
                      </div>
                    ),
                    value: item?.id,
                  }))}
                  value={searchCompanyName}
                  filterOption={false}
                  autoClearSearchValue={false}
                  allowClear
                  onChange={(value: any) => setCompanyId(value)}
                />
              </FormAnt.Item>
            </Col>

            <Col span={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <FormAnt.Item
                  label="Driver"
                  name="customer_id"
                  style={{ width: "90%" }}
                  rules={[
                    { required: true, message: "Please input service points!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Search Driver"
                    onSearch={(value: any) => setCustomerName(value)}
                    options={customerData?.map((item) => ({
                      label: item?.name,
                      value: item?.id,
                    }))}
                    value={customerName}
                    filterOption={false}
                    autoClearSearchValue={false}
                    allowClear
                  />
                </FormAnt.Item>
                <Button
                  onClick={(e) => setDriverOpen(true)}
                  type="primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                  disabled={!companyId}
                >
                  {isMobile && <img src={addicon} alt="" />}
                  {!isMobile && "Add"}
                </Button>
              </div>
            </Col>

            <Col span={12}>
              <FormAnt.Item
                label="Assigned to"
                name="assigned_to_id"
                rules={[
                  {
                    required: true,
                    message: "Please select one of the teams!",
                  },
                ]}
              >
                <Select
                  placeholder="Teams"
                  options={TeamData?.data?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  onChange={(value) =>
                    form.setFieldsValue({ assigned_to_id: value })
                  }
                />
              </FormAnt.Item>
            </Col>

            <Col span={12}>
              <FormAnt.Item
                label="Service"
                name="service_id"
                rules={[{ required: true, message: "Please select service!" }]}
              >
                <Select options={serviceOptions?.sort(sortByLabel)} />
              </FormAnt.Item>
            </Col>

            <Col span={isMobile ? 12 : 12}>
              <FormAnt.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: false,
                    message: "Please input service points!",
                  },
                ]}
              >
                <Select defaultValue="New">
                  <Option value="New">New</Option>
                  <Option value="Checking">Checking</Option>
                  <Option value="Done">Done</Option>
                </Select>
              </FormAnt.Item>
            </Col>

            <Col span={isMobile ? 12 : 12}>
              <FormAnt.Item
                label="PTI"
                name="pti"
                rules={[
                  { required: false, message: "Please input service points!" },
                ]}
              >
                <Switch />
              </FormAnt.Item>
            </Col>

            <Col span={24}>
              <FormAnt.Item
                label="Note"
                name="note"
                rules={[
                  { required: false, message: "Please input service points!" },
                ]}
              >
                <TextArea
                  style={{ padding: "7px 11px" }}
                  placeholder="note"
                  autoSize={{ minRows: isMobile ? 1 : 2, maxRows: 1 }}
                  onChange={changeText}
                  value={text}
                />
                {!isMobile && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Radio.Group
                      options={noteOptions}
                      onChange={onChange}
                      // value={value}
                      optionType="button"
                      defaultValue={""}
                      style={{ marginRight: 15 }}
                    />
                    <Radio.Group
                      options={noteOptions2}
                      defaultValue={""}
                      onChange={onChange2}
                      // value={value}
                      optionType="button"
                    />
                  </div>
                )}
                <br />
              </FormAnt.Item>
            </Col>
          </Row>
        </FormAnt>
        <FormAnt>
          <Row gutter={[16, 16]}>
            <Col span={isMobile ? 6 : 24}>
              <FormAnt.Item name="attachment">
                <div>
                  <Upload.Dragger
                    name="file"
                    height={174}
                    multiple={true}
                    customRequest={({ file, onSuccess }: any) => {
                      const formData = new FormData();
                      formData.append("file", file);
                      taskController
                        .addTaskFile({ task_id: undefined, files: [file] })
                        .then((response) => {
                          const fileId = response.data.file_ids[0];
                          setFileIds((prevFileIds): any => [
                            ...prevFileIds,
                            fileId,
                          ]);
                          onSuccess();
                        });
                    }}
                  >
                    {!isMobile ? (
                      <p className={`ant-upload-drag-icon`}>
                        <img src={fileUpload} />
                      </p>
                    ) : (
                      <UploadOutlined />
                    )}
                    {!isMobile && (
                      <p
                        className="ant-upload-text"
                        style={{ color: "#9b9daa", fontSize: 14 }}
                      >
                        <strong> Drag and drop files or </strong>
                        <span style={{ color: "#f99e2c" }}>
                          Click to select
                        </span>
                        <br />
                        <span style={{ fontSize: 13 }}>
                          Maximum file size is 10 MB <br />
                          (only .jpeg .jpg .png .pdf)
                        </span>
                      </p>
                    )}
                  </Upload.Dragger>
                </div>
              </FormAnt.Item>
            </Col>
          </Row>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddTask;
