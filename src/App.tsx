import React, { useEffect, useState } from "react";
import "./App.css";
import { Layout, Menu, ConfigProvider, Dropdown } from "antd";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { allMenu, mainItems, superItems } from "./Utils/sidebar";
import Login from "./Auth/Login";
import Notfound from "./Utils/Notfound";
import { LogoutApi } from "./API/auth/Logout";
import { Link } from "react-router-dom";
// @ts-ignore
import themeBtn from "./assets/theme-btn.svg";
// @ts-ignore
import avatar from "./assets/avatar-img.svg";
import Register from "./Auth/Register";
import Activate from "./Auth/Activate";
import Invite from "./Auth/Invite";
import ResetPassword from "./Auth/ResetPassword";
import ResetByEmail from "./Auth/ResetByEmail";

const { Header, Sider, Content } = Layout;
const userJSON: any = localStorage.getItem("user");
const userObject = JSON.parse(userJSON);
export const timeZone = userObject?.timezone;
export const role = userObject?.role;
export const admin_id = localStorage.getItem("admin_id");
export const team_id = userObject?.team_id;

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem("access") as string;
  const authorized = isAuthenticated;
  const [collapsed, setCollapsed] = useState<any>(
    localStorage.getItem("collapsed") === "true" ? true : false
  );
  const [theme, setTheme] = useState<any>(
    localStorage.getItem("theme") === "true" ? true : false
  );

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
  const dark = {
    components: {
      Table: {
        colorBgContainer: "#202020",
        colorText: "#BBBBBB",
        headerColor: "#BBBBBB",
        borderColor: "#3A3A3A",
        headerSplitColor: "#3A3A3A",
        rowHoverBg: "#333333",
        colorBorder: "#3A3A3A",
      },
      Layout: {
        bodyBg: "#181818",
      },
      Input: {
        colorBgContainer: "#2A2A2A",
        colorBgContainerDisabled: "#2A2A2A",
        colorText: "#BBBBBB",
        colorTextPlaceholder: "#BBBBBB",
        colorBorder: "#3A3A3A",
        colorFillSecondary: "rgba(0, 0, 0, 0.02)",
        activeBorderColor: "#3A3A3A",
        activeShadow: "#3A3A3A",
        hoverBorderColor: "#3A3A3A",
        // colorIcon: "#BBBBBB",
        // colorIconHover: "#BBBBBB",
      },
      Select: {
        colorBgContainer: "#2A2A2A",
        colorText: "#BBBBBB",
        colorTextPlaceholder: "#BBBBBB",
        colorBorder: "rgba(150, 150, 150, 0.493)",
        colorPrimaryHover: "rgba(249, 158, 44, 1)",
        colorIconHover: "#BBB",
        optionSelectedBg: "#2A2A2A",
        colorBgElevated: "#333",
        controlOutline: "none",
        optionActiveBg: "#333333",
        colorTextQuaternary: "#3A3A3A",
      },
      Button: {
        colorBorderSecondary: "rgba(249, 158, 44, 1)",
        colorPrimary: "rgba(249, 158, 44, 1)",
        colorPrimaryHover: "#BBBBBB",
        colorIcon: "rgba(249, 158, 44, 1)",
        colorIconHover: "rgba(249, 158, 44, 1)",
        primaryShadow: "none",
        dangerShadow: "none",
        colorTextDisabled: "#AAAAAA",
        borderColorDisabled: "#3A3A3A",
      },
      //   Form: {
      //     labelColor: "#BBBBBB",
      //   },
      Tabs: {
        itemColor: "#BBBBBB",
        itemHoverColor: "#FFFFFF",
        itemSelectedColor: "rgba(249, 158, 44, 1)",
        colorPrimaryActive: "rgba(249, 158, 44, 1)",
        inkBarColor: "rgba(249, 158, 44, 1)",
      },
      //   Upload: {
      //     colorText: "#FFFFFF",
      //     colorInfoBgHover: "#1E1E1E",
      //   },
      //   Pagination: {
      //     colorText: "#BBBBBB",
      //     colorPrimary: "#FFFFFF",
      //     colorBgContainer: "#1A1A1A",
      //     colorBorderSecondary: "#3A3A3A",
      //   },
      Modal: {
        contentBg: "#3A3A3A",
        headerBg: "#3A3A3A",
        titleColor: "#FFFFFF",
        colorText: "#BBBBBB",
        colorBgTextActive: "#BBBBBB",
        colorBgTextHover: "#BBBBBB",
      },
      Menu: {
        darkItemSelectedBg: "#3A3A3A",
        colorBgContainer: "#fff",
      },
      Switch: {
        colorPrimary: "#565656",
        colorPrimaryHover: "#737373",
      },
      Radio: {
        colorText: "#737373",
        colorBorder: "#3A3A3A",
        colorPrimaryActive: "#BBBBBB",
        buttonCheckedBg: "rgba(249, 158, 44, 1)",
        colorPrimaryHover: "#737373",
        colorPrimary: "#565656",
      },
      Dropdown: {
        colorBgContainer: "#3A3A3A",
        colorText: "#BBBBBB",
        colorPrimaryHover: "#565656",
        colorPrimary: "#333333",
      },
      DatePicker: {
        colorBgContainer: "#3A3A3A",
        colorBgElevated: "#3A3A3A",
        colorText: "#BBBBBB",
        colorTextPlaceholder: "#BBBBBB",
        colorIcon: "#fff",
        colorIconHover: "#fff",
        colorPrimary: "rgba(249, 158, 44, 1)",
        hoverBorderColor: "#BBBBBB",
      },
      Empty: {
        colorText: "rgba(249, 158, 44, 1)",
        colorTextDisabled: "rgba(249, 158, 44, 1)",
      },
    },
    token: {
      fontFamily: "Inter, sans-serif",
      colorText: "#bbb",
      borderRadius: 8,
    },
  };
  const light = {
    components: {
      Table: {
        rowHoverBg: "#bae0ff",
        headerBg: "none",
        colorText: "rgba(24, 26, 41, 1)",
        fontWeightStrong: 500,
        colorTextHeading: "rgba(161, 162, 171, 1)",
      },
      Select: {
        colorTextPlaceholder: "rgba(155, 157, 170, 1)",
        colorPrimary: "rgba(249, 158, 44, 1)",
        colorPrimaryHover: "rgba(249, 158, 44, 1)",
      },
      Tabs: {
        inkBarColor: "rgba(249, 158, 44, 1)",
        itemSelectedColor: "rgba(24, 26, 41, 1)",
        itemHoverColor: "rgba(24, 26, 41, 1)",
      },
      Input: {
        hoverBorderColor: "rgba(249, 158, 44, 1)",
        activeBorderColor: "rgba(249, 158, 44, 1)",
        colorTextPlaceholder: "rgba(155, 157, 170, 1)",
      },
      Upload: {
        colorPrimaryHover: "rgba(249, 158, 44, 1)",
      },
      Button: {
        colorPrimary: "rgba(249, 158, 44, 1)",
        colorPrimaryHover: "rgba(249, 158, 44, 1)",
      },
      Textarea: {
        colorBorder: "0px 1px 3px 0px rgba(20, 22, 41, 0.1)",
      },
      Menu: {
        darkItemSelectedBg: "rgba(255, 255, 255, 0.08)",
      },
    },
    token: {
      fontFamily: "Inter, sans-serif",
      color: "#262626",
      borderRadius: 8,
    },
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
            <Sider
              theme={"dark"}
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
              style={{
                height: "100vh",
                background: theme === true ? "#202020" : "rgba(20, 22, 41, 1)",
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
            <Layout className="site-layout">
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
                        <div
                          className="d-flex profile-dropdown-text"
                          style={{ flexDirection: "column" }}
                        >
                          <p
                            className={
                              !theme ? "business-name" : "business-name-dark"
                            }
                          >
                            {userObject?.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              </Header>
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
                  {mainItems &&
                    mainItems.map((u) => (
                      <Route key={u.key} path={u.path} element={u.component} />
                    ))}
                  {superItems &&
                    superItems.map((u) => (
                      <Route key={u.key} path={u.path} element={u.component} />
                    ))}
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
