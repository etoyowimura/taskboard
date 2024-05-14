import { Input, Modal, Form as FormAnt, Switch, Select } from "antd";
import { companyController } from "../../API/LayoutApi/companies";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { TCompany } from "../../types/Company/TCompany";
import { TPagination } from "../../types/common/TPagination";

const AddCompany = ({
  open,
  setOpen,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TPagination<TCompany[]>, unknown>>;
  open: boolean;
  setOpen(open: boolean): void;
}) => {
  const [form] = FormAnt.useForm();

  const handleCancel = () => {
    setOpen(!open);
  };

  const eld = [
    { name: "Zippy" },
    { name: "EVO" },
    { name: "Ontime" },
    { name: "Zeelog" },
    { name: "TT" },
  ];

  return (
    <div>
      <Modal
        open={open}
        title="Add Company"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form.validateFields().then(async (values) => {
            await companyController
              .addCompanyController(values)
              .then((data) => {
                if (data) {
                  form.resetFields();
                  setOpen(!open);
                }
              });
            refetch();
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter company name!" }]}
          >
            <Input />
          </FormAnt.Item>
          <FormAnt.Item
            label="Source"
            name="source"
            rules={[{ required: false, message: "Please input owner name!" }]}
          >
            <Select
              options={eld?.map((item) => ({
                label: item?.name,
                value: item?.name,
              }))}
            />
          </FormAnt.Item>
          <FormAnt.Item
            label="Is Active"
            name="is_active"
            rules={[
              { required: false, message: "Please input company status!" },
            ]}
          >
            <Switch defaultChecked={true} />
          </FormAnt.Item>
          <FormAnt.Item
            label="USDOT"
            name="usdot"
            rules={[
              { required: false, message: "Please input company status!" },
            ]}
          >
            <Input />
          </FormAnt.Item>
          <FormAnt.Item
            label="API Key"
            name="api_key"
            rules={[
              { required: false, message: "Please input company status!" },
            ]}
          >
            <Input />
          </FormAnt.Item>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddCompany;
