import { Button, DatePicker, Tabs, Typography } from "antd";
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { theme } from "antd";

import currentMonthActive from "../../assets/currentMonthActive.svg";
import currentMonth from "../../assets/currentMonth.svg";

import lastMonth from "../../assets/lastMonth.svg";
import lastMonthActive from "../../assets/lastMonthActive.svg";

import historyActive from "../../assets/historyActive.svg";
import history from "../../assets/history.svg";

import React, { useMemo, useState } from "react";

import TabPane from "antd/es/tabs/TabPane";
import AccountingCurrent from "./AccountingCurrent";
import AccountingLast from "./AccountingLast";
import AccountingHistory from "./AccountingHistory";
import dayjs from "dayjs";
import { useAccountingData } from "../../Hooks/Accounting";
import ConfirmedMonths from "./ConfirmedMonths";

const Accounting: React.FC = () => {
  const { token } = theme.useToken();

  const [activeTab, setActiveTab] = useState("1");

  const month = activeTab === "" ? "current" : "last";

  const { data, isLoading, refetch } = useAccountingData({
    month: month,
  });

  const now = dayjs();
  const perviousMonth = now.subtract(1, "month");

  return (
    <div>
      <div
        className="header d-flex  statistics-header"
        style={{ marginBottom: 16 }}
      >
        <Typography className="title">Salaries</Typography>
        {activeTab == "1" ? (
          <div className="d-flex">
            <DatePicker
              picker="month"
              format={"MMMM"}
              defaultValue={now}
              style={{
                marginRight: 10,
                width: 260,
                height: 36,
              }}
              disabled
            />
            <Button
              className="d-flex"
              style={{
                backgroundColor: token.colorBgContainer,
                color: token.colorText,
                padding: 18,
              }}
              icon={<ReloadOutlined />}
              onClick={() => {
                refetch();
              }}
            >
              Refresh
            </Button>
          </div>
        ) : (
          ""
        )}
        {activeTab == "2" ? (
          <div className="d-flex">
            <DatePicker
              picker="month"
              format={"MMMM"}
              defaultValue={perviousMonth}
              style={{
                marginRight: 10,
                width: 260,
                height: 36,
              }}
              disabled
            />
            <Button
              className="d-flex"
              style={{
                backgroundColor: token.colorBgContainer,
                color: token.colorText,
                padding: 18,
              }}
              icon={<ReloadOutlined />}
              onClick={() => {
                refetch();
              }}
            >
              Refresh
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>

      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "1" ? currentMonthActive : currentMonth}
                alt="icon"
              />
              Current Month
            </span>
          }
          key="1"
        >
          <AccountingCurrent />
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "2" ? lastMonthActive : lastMonth}
                alt="icon"
              />
              Last Month
            </span>
          }
          key="2"
        >
          <AccountingLast />
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <CheckCircleOutlined
                style={{
                  fontSize: 16,
                  marginRight: 5,
                  color: activeTab === "3" ? "#F99E2C" : "#A1A2AB",
                }}
              />
              Confirmed Months
            </span>
          }
          key="3"
        >
          <ConfirmedMonths />
        </TabPane>
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginRight: 5 }}
                src={activeTab === "4" ? historyActive : history}
                alt="icon"
              />
              History
            </span>
          }
          key="4"
        >
          <AccountingHistory />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Accounting;
