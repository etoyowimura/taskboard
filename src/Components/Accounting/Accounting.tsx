import { Tabs, Typography } from "antd";

import React, { useState } from "react";

import TabPane from "antd/es/tabs/TabPane";
import AccountingCurrent from "./AccountingCurrent";
import AccountingLast from "./AccountingLast";
import AccountingHistory from "./AccountingHistory";

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div>
      <div
        className="header d-flex  statistics-header"
        style={{ marginBottom: 16 }}
      >
        <Typography className="title">Accounting</Typography>
      </div>

      <Tabs
        defaultActiveKey="1"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane
          tab={
            <span style={{ display: "flex", alignItems: "center" }}>
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
              History
            </span>
          }
          key="3"
        >
          <AccountingHistory />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Accounting;
