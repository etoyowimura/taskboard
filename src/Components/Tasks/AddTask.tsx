import {
  Input,
  Modal,
  Form as FormAnt,
  Select,
  Upload,
  Switch,
  Button,
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
import AddCustomer from "../Customers/AddCustomer";
import AddDriver from "../Companies/AddDriver";
import TextArea from "antd/es/input/TextArea";

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
  const [companyId, setCompanyId] = useState<string>();
  const ServiceData = useServiceData();

  const TeamData = useTeamData("");
  const companyData = useCompanyData({ name: companyName });
  const customerData = useCustomerByComanyData({
    id: companyId,
    name: customerName,
  });

  const [driverOpen, setDriverOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  function handlePaste(event: any) {
    const clipboardData = event.clipboardData || window.Clipboard;
    if (clipboardData && clipboardData.items.length > 0) {
      const clipboardItem = clipboardData.items[0];
      if (clipboardItem.kind === "file") {
        const file = clipboardItem.getAsFile();

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            setPreviewImage(e.target.result as string);
          }
        };
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
            // const updatedValues = { ...values };
            values.attachment_ids = fileIds;
            form.resetFields();
            await taskController.addTaskController(values);
            setOpen(!open);
          });
        }}
      >
        <FormAnt
          form={form}
          layout="horizontal"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
            <Button onClick={(e) => setDriverOpen(true)} type="primary">
              Add
            </Button>
          </div>

          <FormAnt.Item
            label="Service"
            name="service_id"
            rules={[{ required: true, message: "Please select service!" }]}
          >
            <Select
              options={ServiceData?.data?.map((item) => ({
                label: item?.title,
                value: item?.id,
              }))}
            />
          </FormAnt.Item>

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

          <FormAnt.Item
            label="PTI"
            name="pti"
            rules={[
              { required: false, message: "Please input service points!" },
            ]}
          >
            <Switch />
          </FormAnt.Item>

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
              autoSize={{ minRows: 3, maxRows: 3 }}
            />
          </FormAnt.Item>
        </FormAnt>
        <FormAnt>
          <FormAnt.Item name="attachment">
            <div>
              <Upload.Dragger
                name="file"
                multiple={true}
                customRequest={({ file, onSuccess }: any) => {
                  const formData = new FormData();
                  formData.append("file", file);
                  taskController
                    .addTaskFile({ task_id: undefined, files: [file] })
                    .then((response) => {
                      console.log(response);

                      const fileId = response.data.file_ids[0];
                      setFileIds((prevFileIds): any => [
                        ...prevFileIds,
                        fileId,
                      ]);
                      onSuccess();
                      // const updatedValues = form.getFieldsValue();
                      // updatedValues.attachment_ids = [
                      //   ...updatedValues.attachment_ids,
                      //   fileId,
                      // ];
                      // form.setFieldsValue(updatedValues);
                    });
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ color: "rgba(249, 158, 44, 1)" }} />
                </p>
                <p
                  className="ant-upload-text"
                  style={{ color: "rgba(249, 158, 44, 1)" }}
                >
                  Click or drag a file here to upload
                </p>
              </Upload.Dragger>
            </div>
          </FormAnt.Item>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddTask;
