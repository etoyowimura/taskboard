import { Modal, Select, Button } from "antd";
import { TRequests } from "../../types/Requests/TRequests";
import { useEffect, useState } from "react";
import {
  useCustomerByComanyData,
  useCustomerData,
} from "../../Hooks/Customers";
import { requestsController } from "../../API/LayoutApi/requests";
// @ts-ignore
import plus from "../../assets/add-icon.png";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { useCompanyData } from "../../Hooks/Companies";
import { TPagination } from "../../types/common/TPagination";
const RequestsEdit = ({
  modalOpen,
  setModalOpen,
  requestData,
  refetch,
}: {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TPagination<TRequests[]>, unknown>>;
  modalOpen: any;
  setModalOpen: any;
  requestData: TRequests | undefined;
}) => {
  const theme = localStorage.getItem("theme") === "true" ? true : false;
  const handleCancel = () => {
    setModalOpen(!modalOpen);
  };

  const [companyName, setCompanyName] = useState<string>();
  const [customerName, setCustomerName] = useState<string>();
  const [driverId, setDriverId] = useState<number>();
  const companyData = useCompanyData({ name: companyName });
  const [companyId, setCompanyId] = useState<number>();
  const [customerOption, setCustomerOption] = useState<any>();
  const customerData = useCustomerData({
    name: customerName,
    page: 1,
    page_size: 5,
    for_driver_request: true,
  });
  const customerDataByCompany = useCustomerByComanyData(
    {
      name: customerName,
      for_driver_request: true,
    },
    companyId
  );

  useEffect(() => {
    if (companyId && customerDataByCompany) {
      const newCustomerOption = customerDataByCompany.data?.data?.map(
        (item) => ({
          label: item.name,
          value: item.id,
        })
      );

      if (
        JSON.stringify(newCustomerOption) !== JSON.stringify(customerOption)
      ) {
        setCustomerOption(newCustomerOption);
      }
    } else if (!companyId && customerData) {
      const newCustomerOption = customerData.data?.data.map((item) => ({
        label: `${item?.name} - ${item.company?.name}`,
        value: item.id,
      }));

      if (
        JSON.stringify(newCustomerOption) !== JSON.stringify(customerOption)
      ) {
        setCustomerOption(newCustomerOption);
      }
    }
  }, [companyId, customerData, customerDataByCompany, customerOption]);

  const assignClick = () => {
    const value = {
      ...requestData,
      status: "Assigned",
      customer_id: driverId,
    };
    requestsController.requestPatch(value, requestData?.id).then(() => {
      refetch();
      setModalOpen(false);
    });
  };

  return (
    <div>
      <Modal
        onCancel={handleCancel}
        footer={null}
        open={modalOpen}
        width={1000}
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
            {requestData?.telegram_user_link && (
              <tr>
                <p className={!theme ? "sub" : "sub-dark"}>Telegram User</p>
                <p className={!theme ? "info" : "info-dark"}>
                  {requestData?.telegram_user_link ? (
                    <a href={requestData?.telegram_user_link}>Open Chat</a>
                  ) : (
                    "This user has no username"
                  )}
                </p>
              </tr>
            )}
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
            <div
              className="search-driver"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div className="d-flex" style={{ width: "100%" }}>
                <Select
                  showSearch
                  style={{ marginRight: 15, width: "40%" }}
                  placeholder="Search Company"
                  onSearch={(value) => setCompanyName(value)}
                  onChange={(value: number) => setCompanyId(value)}
                  options={companyData?.data?.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                  filterOption={false}
                  autoClearSearchValue={false}
                  allowClear
                />
                <Select
                  style={{ width: "50%" }}
                  showSearch
                  placeholder="Search Driver"
                  onSearch={(value) => setCustomerName(value)}
                  onChange={(value: number) => setDriverId(value)}
                  options={customerOption}
                  filterOption={false}
                  autoClearSearchValue={false}
                  allowClear
                />
                <Button
                  type="primary"
                  onClick={assignClick}
                  disabled={driverId ? false : true}
                  style={{ marginLeft: 15, width: "10%" }}
                >
                  Assign
                </Button>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={assignClick}
                  disabled={driverId ? true : false}
                  style={{
                    padding: "6px 15px",
                    marginTop: 15,
                    marginRight: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="btn-add"
                >
                  <img src={plus} alt="" style={{ marginRight: 8 }} />
                  New driver
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RequestsEdit;
