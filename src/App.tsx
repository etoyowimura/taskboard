import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Layout, Menu, ConfigProvider, Dropdown, notification } from "antd";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { mainItems, superItems } from "./Utils/sidebar";
import Login from "./Auth/Login";
import Notfound from "./Utils/Notfound";
import { LogoutApi } from "./API/auth/Logout";
import { Link } from "react-router-dom";
import { MenuProps } from "antd";
// @ts-ignore
import themeBtn from "./assets/theme-btn.svg";
// @ts-ignore
import avatar from "./assets/avatar-img.svg";
// @ts-ignore
import taskIcon from "./assets/tasknavicon.png";
// @ts-ignore
import companyIcon from "./assets/companynavicon.png";
// @ts-ignore
import serviceIcon from "./assets/servicenavicon.png";
// @ts-ignore
import teamIcon from "./assets/teamnavicon.png";
// @ts-ignore
import statisticIcon from "./assets/statnavicon.png";
// @ts-ignore
import updateIcon from "./assets/updatenavicon.png";
// @ts-ignore
import userIcon from "./assets/usernavicon.png";
// @ts-ignore
import driverIcon from "./assets/customersIcon.png";
// @ts-ignore
import requestIcon from "./assets/requestIcon.png";
// @ts-ignore
import callIcon from "./assets/callIcon.png";
import Register from "./Auth/Register";
import Activate from "./Auth/Activate";
import Invite from "./Auth/Invite";
import ResetPassword from "./Auth/ResetPassword";
import ResetByEmail from "./Auth/ResetByEmail";
import { NotificationPlacement } from "antd/es/notification/interface";
import { TCall } from "./types/CallRequests/TCall";
import Task from "./Components/Tasks/Tasks";
import Requests from "./Components/Requests/Requests";
import { callController } from "./API/LayoutApi/callrequests";
import Call from "./Components/CallRequests/Call";
import { dark, light } from "./Utils/styles";
const { Header, Sider, Content } = Layout;
const userJSON: any = localStorage.getItem("user");
const userObject = JSON.parse(userJSON);
export const timeZone = userObject?.timezone;
export const role = userObject?.role;
export const admin_id = localStorage.getItem("admin_id");
export const team_id = userObject?.team?.id;
export const isMobile = window.innerWidth <= 768;
const username = localStorage.getItem("username");

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem("access") as string;
  const authorized = isAuthenticated;
  const [collapsed, setCollapsed] = useState<any>(
    localStorage.getItem("collapsed") === "true" ? true : false
  );
  const [theme, setTheme] = useState<any>(
    localStorage.getItem("theme") === "true" ? true : false
  );
  const [calls, setCalls] = useState(0);
  const [data, setData] = useState<any>();
  useEffect(() => {
    if (admin_id) {
      callController
        .read({ status: "Awaiting", page: 1, page_size: 100 })
        .then((data: any) => {
          setData(data);
        });
    }
  }, []);

  useEffect(() => {
    if (data) {
      setCalls(data.data?.length);
    }
  }, [data]);
  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  const allMenu: MenuItem[] = [
    getItem(<Link to="/">Tasks</Link>, "/", <img alt="" src={taskIcon} />),
    getItem(
      <Link to="companies/">Companies</Link>,
      "companies/",
      <img alt="" src={companyIcon} />
    ),
    getItem(
      <Link to="customers/">Drivers</Link>,
      "customers/",
      <img alt="" src={driverIcon} />
    ),
    getItem(
      <Link to="services/">Services</Link>,
      "services/",
      <img alt="" src={serviceIcon} />
    ),
  ];

  if (role === "Tech Support") {
    allMenu.push(
      getItem(
        <Link to="users/">Users</Link>,
        "users/",
        <img alt="" src={userIcon} />
      ),
      getItem(
        <Link to="teams/">Teams</Link>,
        "teams/",
        <img alt="" src={teamIcon} />
      ),
      getItem(
        <Link to="updates/">Updates</Link>,
        "updates/",
        <img alt="" src={updateIcon} />
      ),
      getItem(
        <Link to="requests/">Driver Requests</Link>,
        "requests/",
        <img alt="" src={requestIcon} />
      ),
      getItem(
        <Link to="calls/">Call Requests</Link>,
        "calls/",
        <img alt="" src={callIcon} />
      )
    );
  }

  if (role === "Owner") {
    allMenu.push(
      getItem(
        <Link to="users/">Users</Link>,
        "users/",
        <img alt="" src={userIcon} />
      ),
      getItem(
        <Link to="teams/">Teams</Link>,
        "teams/",
        <img alt="" src={teamIcon} />
      ),
      getItem(
        <Link to="stats/">Statistics</Link>,
        "stats/",
        <img alt="" src={statisticIcon} />
      ),
      getItem(
        <Link to="updates/">Updates</Link>,
        "updates/",
        <img alt="" src={updateIcon} />
      ),
      getItem(
        <Link to="requests/">Driver Requests</Link>,
        "requests/",
        <img alt="" src={requestIcon} />
      ),
      getItem(
        <Link to="calls/">
          Call Requests{" "}
          <span className={`${calls !== 0 ? "call-requests" : "call-none"}`}>
            {calls}
          </span>
        </Link>,
        "calls/",
        <img alt="" src={callIcon} />
      )
    );
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("collapsed", collapsed);
  }, [collapsed]);

  let location: any = useLocation();
  const clickLogout = () => {
    LogoutApi();
  };

  const rep = () => {
    document.location.replace("/");
  };
  const menu: any = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="profile/">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={clickLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  // const reconnectingMessageKey = "reconnectingMessage";
  // const reconnectingMessageContent = "Reconnecting...";

  // useEffect(() => {
  //   let reconnectingTimeout: NodeJS.Timeout | null = null;

  //   const handleOnlineStatus = () => {
  //     setIsOnline(true);
  //     message.success({ content: "Reconnected!" });
  //     if (isOnline === false) {
  //       message.destroy(reconnectingMessageKey);
  //     }
  //     if (reconnectingTimeout) {
  //       clearTimeout(reconnectingTimeout);
  //     }
  //   };

  //   const handleOfflineStatus = () => {
  //     setIsOnline(false);
  //     if (isOnline !== false) {
  //       message.loading({
  //         content: reconnectingMessageContent,
  //         key: reconnectingMessageKey,
  //         duration: 0,
  //       });
  //       reconnectingTimeout = setTimeout(() => {
  //         message.destroy(reconnectingMessageKey);
  //       }, 30 * 60 * 1000); // 30 minutes
  //     }
  //   };

  //   window.addEventListener("online", handleOnlineStatus);
  //   window.addEventListener("offline", handleOfflineStatus);

  //   return () => {
  //     window.removeEventListener("online", handleOnlineStatus);
  //     window.removeEventListener("offline", handleOfflineStatus);
  //     if (reconnectingTimeout) {
  //       clearTimeout(reconnectingTimeout);
  //     }
  //   };
  // }, [isOnline]);
  let taskSocket: WebSocket;
  const [isLive, setIslive] = useState(false);
  const [socketData, setSocketData] = useState<any>();
  const connect = async () => {
    try {
      if (
        (!taskSocket || taskSocket.readyState === WebSocket.CLOSED) &&
        admin_id
      ) {
        // taskSocket = new WebSocket(
        //   `ws://10.10.10.64:8080/global/?user_id=${admin_id}`
        // );
        taskSocket = new WebSocket(
          `wss://api.tteld.co/global/?user_id=${admin_id}`
        );

        taskSocket.addEventListener("open", (event) => {
          setIslive(true);
        });
        taskSocket.addEventListener("message", (event) => {
          const newData: any = JSON.parse(event.data);
          setSocketData(newData);
        });
        taskSocket.addEventListener("error", (errorEvent) => {
          console.error("WebSocket error:", errorEvent);
        });
        taskSocket.addEventListener("close", (event) => {
          console.log("WebSocket: clocse");
          setIslive(false);
        });
      }
    } catch (err) {}
  };

  useEffect(() => {
    connect();
  }, []);

  // function checkConnection() {
  //   if (!isLive) {
  //     connect();
  //   }
  // }

  // setInterval(checkConnection, 5000);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = useCallback(
    (placement: NotificationPlacement, data: TCall) => {
      api.info({
        message: `Driver ${data?.driver?.name} from ${data?.company?.name} company has made a call request`,
        placement,
      });
    },
    [api]
  );
  useEffect(() => {
    if (socketData?.type === "callback_request") {
      let status = socketData?.callback_request.status;
      if (status === "Awaiting") {
        openNotification("bottomRight", socketData?.callback_request);
        setCalls((prev: any) => prev + 1);
      } else if (status === "Resolved" && calls !== 0) {
        setCalls((prev: any) => prev - 1);
      }
    }
  }, [socketData, openNotification]);

  return (
    <ConfigProvider theme={theme === true ? dark : light}>
      <div>
        {!authorized &&
          !(
            location.pathname.startsWith("/auth/register") ||
            location.pathname.startsWith("/auth/activate") ||
            location.pathname.startsWith("/auth/reset_password") ||
            location.pathname.startsWith("/auth/reset-password") ||
            location.pathname.startsWith("/auth/login") ||
            location.pathname.startsWith("/auth/invite")
          ) && (
            <Navigate
              to={{
                pathname: "/auth/login",
              }}
            />
          )}
        {authorized && location.pathname === "/login" && (
          <Navigate
            to={{
              pathname: "/",
            }}
          />
        )}
        {authorized ? (
          <Layout>
            {contextHolder}
            {isMobile ? (
              <div className=""></div>
            ) : (
              <Sider
                theme={"dark"}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{
                  height: "100vh",
                  background:
                    theme === true ? "#202020" : "rgba(20, 22, 41, 1)",
                }}
              >
                <p
                  onClick={rep}
                  style={{ cursor: "pointer" }}
                  className={collapsed ? "logo-collapsed" : "logo"}
                >
                  TT ELD
                </p>
                <Menu
                  theme={"dark"}
                  mode="inline"
                  defaultSelectedKeys={[location.pathname]}
                  items={allMenu}
                  style={{
                    background:
                      theme === true ? "#202020" : "rgba(20, 22, 41, 1)",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                ></Menu>
              </Sider>
            )}
            <Layout className="site-layout">
              {isMobile ? (
                <Header style={{ padding: 0 }}>
                  <div className="demo-logo" />
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["2"]}
                    items={allMenu}
                    style={{
                      background:
                        theme === true ? "#202020" : "rgba(20, 22, 41, 1)",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  />
                </Header>
              ) : (
                <Header
                  className="site-layout-background"
                  style={{
                    padding: 0,
                    background:
                      theme === true ? "#202020" : "rgba(215, 216, 224, 1)",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      float: "right",
                      marginRight: "35px",
                      display: "flex",
                      alignItems: "center",
                      alignSelf: "center",
                      minWidth: 150,
                      maxWidth: 500,
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      className="theme-btn"
                      onClick={(e) => setTheme(!theme)}
                    >
                      <img src={themeBtn} alt="" />
                    </button>
                    <Dropdown overlay={menu} trigger={["click"]}>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={(e) => e.preventDefault()}
                      >
                        <div className="profile-dropdown">
                          <div className="profile-dropdown-ava">
                            <img src={avatar} alt="" />
                          </div>
                          <div className="d-flex profile-dropdown-text">
                            <p
                              className={
                                !theme ? "business-name" : "business-name-dark"
                              }
                            >
                              {username}
                              {isLive ? (
                                <div
                                  className="d-flex"
                                  style={{ marginRight: 15 }}
                                >
                                  <div className="circle"></div>
                                  <p
                                    className={
                                      !theme ? "live-p" : "live-p-dark"
                                    }
                                  >
                                    online
                                  </p>
                                </div>
                              ) : (
                                <div
                                  className="d-flex"
                                  style={{ marginRight: 15 }}
                                >
                                  <div className="circle2"></div>
                                  <p className="live-p">offline</p>
                                </div>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                </Header>
              )}
              <Content
                id="element"
                style={{
                  padding: 24,
                  minHeight: "92vh",
                  maxHeight: "calc(90vh - 10px)",
                  overflowY: "scroll",
                  background: theme === true ? "#202020" : "#fff",
                }}
              >
                <Routes>
                  <Route
                    key={"task"}
                    path="/"
                    element={
                      <Task
                        socketData={socketData}
                        connect={connect}
                        isLive={isLive}
                      />
                    }
                  />
                  {mainItems &&
                    mainItems.map((u) => (
                      <Route key={u.key} path={u.path} element={u.component} />
                    ))}
                  {superItems &&
                    superItems.map((u) => (
                      <Route key={u.key} path={u.path} element={u.component} />
                    ))}
                  {superItems && (
                    <Route
                      key={"requests"}
                      path="/requests/"
                      element={<Requests socketData={socketData} />}
                    />
                  )}
                  {superItems && (
                    <Route
                      key={"calls"}
                      path="/calls/"
                      element={<Call socketData={socketData} />}
                    />
                  )}
                  <Route path="*" element={<Notfound />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        ) : (
          <></>
        )}
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/activate" element={<Activate />} />
          <Route path="/auth/invite" element={<Invite />} />
          <Route path="/auth/reset_password" element={<ResetPassword />} />
          <Route path="/auth/reset-password" element={<ResetByEmail />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
};

export default App;
