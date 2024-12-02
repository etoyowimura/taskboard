import { Input, Modal, Form as FormAnt, Select, Upload } from "antd";
import { updateController } from "../../API/LayoutApi/update";
import { useState } from "react";
import fileUpload from "../../assets/upload-file.png";
import { useCompanyData } from "../../Hooks/Companies";
import { useCustomerByComanyData } from "../../Hooks/Customers";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { TUpdate } from "../../types/Update/TUpdate";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;
const AddUpdate = ({
  refetch,
  open,
  setOpen,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TUpdate[], unknown>>;
  open: boolean;
  setOpen(open: boolean): void;
}) => {
  const [form] = FormAnt.useForm();

  const handleCancel = () => {
    refetch();
    setOpen(!open);
  };
  const [companyName, setCompanyName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [companyId, setCompanyId] = useState<number>();

  const companyData = useCompanyData({ name: companyName });
  const customerData = useCustomerByComanyData(
    {
      name: customerName,
      page: 1,
      page_size: 10,
    },
    companyId
  );

  function handlePaste(event: any) {
    const clipboardData = event.clipboardData || window.Clipboard;
    if (clipboardData && clipboardData.items.length > 0) {
      const clipboardItem = clipboardData.items[0];
      if (clipboardItem.kind === "file") {
        const file = clipboardItem.getAsFile();
        const formData = new FormData();
        formData.append("file", file);
        // taskController.addTaskFile(formData).then((response) => {
        //   const fileId = response.id;
        //   const n = [response.file];
        //   setImgname((prev: any) => [...prev, ...n]);
        //   setFileIds((prevFileIds): any => [...prevFileIds, fileId]);
        //   const updatedValues = form.getFieldsValue();
        //   updatedValues.attachment_ids = [
        //     ...updatedValues.attachment_ids,
        //     fileId,
        //   ];
        //   form.setFieldsValue(updatedValues);
        // });
      }
    }
  }

  return (
    <div onPaste={(event) => handlePaste(event)}>
      <Modal
        open={open}
        title="Add update"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const updatedValues = { ...values };
            form.resetFields();
            await updateController.addUpdateController(updatedValues);
            setOpen(!open);
            refetch();
          });
        }}
      >
        <FormAnt
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <FormAnt.Item
            label="Company"
            name="company_id"
            rules={[{ required: false, message: "Please input company!" }]}
          >
            <Select
              showSearch
              placeholder="Search Company"
              onSearch={(value: any) => setCompanyName(value)}
              options={companyData?.data?.map((item) => ({
                label: item?.name,
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
              gap: 5,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <FormAnt.Item
              style={{ width: "50%" }}
              label="Driver"
              name="customer_id"
              rules={[
                { required: false, message: "Please input service points!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Search Driver"
                onSearch={(value: any) => setCustomerName(value)}
                options={customerData?.data?.data?.map((item) => ({
                  label: item?.name,
                  value: item?.id,
                }))}
                value={customerName}
                filterOption={false}
                autoClearSearchValue={false}
                allowClear
              />
            </FormAnt.Item>

            <FormAnt.Item
              style={{ width: "50%" }}
              label="Status"
              name="status"
              rules={[
                { required: false, message: "Please input service points!" },
              ]}
            >
              <Select defaultValue="New">
                <Option value="New">New</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Done">Done</Option>
                <Option value="Paper">Paper</Option>
                <Option value="Setup">Setup</Option>
              </Select>
            </FormAnt.Item>
          </div>
          <FormAnt.Item
            label="Note"
            name="note"
            rules={[{ required: true, message: "Make note!" }]}
          >
            {/* <Input /> */}
            <TextArea
              placeholder="Enter notes here"
              autoSize={{ minRows: 3, maxRows: 5 }}
              style={{ padding: "7px 11px" }}
            />
          </FormAnt.Item>
        </FormAnt>
        <FormAnt>
          <FormAnt.Item name="attachment">
            <Upload.Dragger
              name="file"
              multiple={true}
              customRequest={({ file, onSuccess }: any) => {
                const formData = new FormData();
                formData.append("file", file);
                // taskController
                //   .addTaskFile(formData)
                //   .then((response) => {
                //     const fileId = response.id;
                //     setFileIds((prevFileIds): any => [...prevFileIds, fileId]);
                //     onSuccess();
                //     const updatedValues = form.getFieldsValue();
                //     updatedValues.attachment_ids = [
                //       ...updatedValues.attachment_ids,
                //       fileId,
                //     ];
                //     form.setFieldsValue(updatedValues);
                //   })
                //   .catch((error) => {
                //     onSuccess(error);
                //   });
              }}
            >
              <p className="ant-upload-drag-icon">
                <img src={fileUpload} alt="upload" />
              </p>
              <p
                className="ant-upload-text"
                style={{ color: "#9b9daa", fontSize: 14 }}
              >
                Drag and drop files or{" "}
                <span style={{ color: "#f99e2c" }}>Click to select</span>
                <br />
                <span style={{ fontSize: 13, color: "#9b9daa" }}>
                  Maximum file size is 10 MB
                </span>
              </p>
            </Upload.Dragger>
          </FormAnt.Item>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddUpdate;
