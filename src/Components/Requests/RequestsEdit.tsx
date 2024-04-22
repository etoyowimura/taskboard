import { Modal, Select, Button } from "antd";
import { TRequests } from "../../types/Requests/TRequests";
import { useState } from "react";
import { useCustomerData } from "../../Hooks/Customers";
import { requestsController } from "../../API/LayoutApi/requests";
// @ts-ignore
import plus from "../../assets/add-icon.png";
const RequestsEdit = ({
  modalOpen,
  setModalOpen,
  requestData,
}: {
  modalOpen: any;
  setModalOpen: any;
  requestData: TRequests | undefined;
}) => {
  const theme = localStorage.getItem("theme") === "true" ? true : false;
  const handleCancel = () => {
    setModalOpen(!modalOpen);
  };

  const [customerName, setCustomerName] = useState<string>();
  const [driverId, setDriverId] = useState<number>();
  const customerData = useCustomerData({
    name: customerName,
  });

  const assignClick = () => {
    const value = {
      ...requestData,
      status: "Assigned",
      customer_id: driverId,
    };
    requestsController.requestPatch(value, requestData?.id);
  };
  return (
    <div>
      <Modal
        onCancel={handleCancel}
        footer={null}
        open={modalOpen}
        width={800}
        maskClosable={true}
      >
        <div className="info-div">
          <div
            className="d-flex"
            style={{ alignItems: "center", marginBottom: 16 }}
          >
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: "-0.02em",
              }}
            >
              Requested Driver Info
            </p>
            <button
              style={{ marginLeft: 12, display: "flex", alignItems: "center" }}
              className={`status-${requestData?.status}`}
            >
              {requestData?.status}
            </button>
          </div>
          <div className="info-body">
            <tr>
              <p className={!theme ? "sub" : "sub-dark"}>Full Name</p>
              <p className={!theme ? "info" : "info-dark"}>
                {requestData?.full_name}
              </p>
            </tr>
            <tr>
              <p className={!theme ? "sub" : "sub-dark"}>Company</p>
              <p className={!theme ? "info" : "info-dark"}>
                {requestData?.company_name}
              </p>
            </tr>
            <tr>
              <p className={!theme ? "sub" : "sub-dark"}>USDOT</p>
              <p className={!theme ? "info" : "info-dark"}>
                {requestData?.company_usdot}
              </p>
            </tr>
          </div>

          {requestData?.status === "Assigned" && (
            <div className="info-div" style={{ margin: 0 }}>
              <div
                className="d-flex"
                style={{ alignItems: "center", marginBottom: 16 }}
              >
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: "24px",
                    marginTop: 20,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Assigned Driver Info
                </p>
              </div>
              <div className="info-body">
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Driver name</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {requestData?.potential_driver?.name}
                  </p>
                </tr>
                <tr>
                  <p className={!theme ? "sub" : "sub-dark"}>Company</p>
                  <p className={!theme ? "info" : "info-dark"}>
                    {requestData?.potential_driver?.company?.name}
                  </p>
                </tr>
              </div>
              <div />
            </div>
          )}
          {requestData?.status === "Pending" && (
            <div className="search-driver">
              <div className="d-flex">
                <Select
                  showSearch
                  style={{ width: 325 }}
                  placeholder="Search Driver"
                  onSearch={(value: any) => setCustomerName(value)}
                  onChange={(e: any) => setDriverId(e)}
                  options={customerData?.data?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  value={customerName}
                  filterOption={false}
                  autoClearSearchValue={false}
                  allowClear
                />
                <Button
                  type="primary"
                  onClick={assignClick}
                  disabled={driverId ? false : true}
                  style={{ marginLeft: 15 }}
                >
                  Assign
                </Button>
              </div>
              <Button
                onClick={assignClick}
                disabled={driverId ? true : false}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 15px",
                  margin: 0,
                }}
                className="btn-add"
              >
                <img src={plus} alt="" style={{ marginRight: 8 }} />
                Add new driver
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RequestsEdit;
