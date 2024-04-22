import { Input, Modal, Form as FormAnt, Select } from "antd";
import { customerController } from "../../API/LayoutApi/customers";
import { useState } from "react";
import { useCompanyData } from "../../Hooks/Companies";
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

const AddCustomer = ({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  refetch: any;
  setOpen(open: boolean): void;
}) => {
  const [form] = FormAnt.useForm();

  const handleCancel = () => {
    setOpen(!open);
  };

  const [companyName, setCompanyName] = useState<string>("");
  const { data } = useCompanyData({ name: companyName });

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
    <div>
      <Modal
        open={open}
        title="Add Driver"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form.validateFields().then(async (values) => {
            form.resetFields();
            await customerController
              .addCustomerController(values)
              .then((data) => {
                if (data) {
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
            rules={[{ required: true, message: "Please input Driver name!" }]}
          >
            <Input />
          </FormAnt.Item>
          <FormAnt.Item
            label="Company"
            name="company_id"
            rules={[{ required: false, message: "Please input Company name!" }]}
          >
            <Select
              showSearch
              placeholder="Search Company"
              onSearch={(value: any) => setCompanyName(value)}
              options={data?.map((item) => ({
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
            />
          </FormAnt.Item>
        </FormAnt>
      </Modal>
    </div>
  );
};

export default AddCustomer;
