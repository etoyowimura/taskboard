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
import { useState } from "react";
import { useServiceData } from "../../Hooks/Services";
import { UploadOutlined } from "@ant-design/icons";
import { useTeamData } from "../../Hooks/Teams";
import { useCompanyData } from "../../Hooks/Companies";
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
import AddCustomer from "../Customers/AddCustomer";
import AddDriver from "../Companies/AddDriver";
import TextArea from "antd/es/input/TextArea";
import { isMobile } from "../../App";

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
  const [companyName, setCompanyName] = useState<string>();
  const [customerName, setCustomerName] = useState<string>();
  const [companyId, setCompanyId] = useState<number>();
  const ServiceData = useServiceData();

  const TeamData = useTeamData("");
  const companyData = useCompanyData({ name: companyName });
  const customerData = useCustomerByComanyData({
    id: companyId,
    name: customerName,
  });

  const [driverOpen, setDriverOpen] = useState(false);

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
  const [openDrive, setOpenDrive] = useState(false);

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

  return (
    <div onPaste={(event) => handlePaste(event)}>
      {openDrive && (
        <AddCustomer
          refetch={customerData.refetch}
          open={openDrive}
          setOpen={setOpenDrive}
        />
      )}
      <AddDriver id={companyId} open={driverOpen} setOpen={setDriverOpen} />
      <Modal
        open={open}
        width={600}
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
          layout={isMobile ? "vertical" : "horizontal"}
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <FormAnt.Item
                label="Company"
                name="company_id"
                rules={[{ required: true, message: "Please input company!" }]}
              >
                <Select
                  showSearch
                  placeholder="Search Company"
                  onSearch={(value: any) => setCompanyName(value)}
                  options={companyData?.data?.map((item) => ({
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
                  value={companyName}
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
                  alignItems: isMobile ? "center" : "none",
                }}
              >
                <FormAnt.Item
                  label="Driver"
                  name="customer_id"
                  style={{ width: "85%" }}
                  rules={[
                    { required: true, message: "Please input service points!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Search Driver"
                    onSearch={(value: any) => setCustomerName(value)}
                    options={customerData?.data?.map((item) => ({
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
                    marginTop: isMobile ? 5 : 0,
                  }}
                >
                  {isMobile && <img src={addicon} alt="" />}
                  {!isMobile && "Add"}
                </Button>
              </div>
            </Col>

            <Col span={isMobile ? 12 : 24}>
              <FormAnt.Item
                label="Service"
                name="service_id"
                rules={[{ required: true, message: "Please select service!" }]}
              >
                <Select options={serviceOptions?.sort(sortByLabel)} />
              </FormAnt.Item>
            </Col>

            <Col span={isMobile ? 12 : 24}>
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
                  options={TeamData?.data?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                />
              </FormAnt.Item>
            </Col>

            <Col span={isMobile ? 12 : 12}>
              <FormAnt.Item
                label="Status"
                name="status"
                rules={[
                  { required: false, message: "Please input service points!" },
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
                    height={isMobile ? 100 : 150}
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
                        <UploadOutlined
                          style={{ color: "rgba(249, 158, 44, 1)" }}
                        />
                      </p>
                    ) : (
                      <UploadOutlined />
                    )}
                    {!isMobile && (
                      <p
                        className="ant-upload-text"
                        style={{ color: "rgba(249, 158, 44, 1)" }}
                      >
                        Click or drag a file here to upload (only .jpeg .jpg
                        .png .pdf)
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
