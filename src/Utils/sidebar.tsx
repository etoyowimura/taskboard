import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import Company from "../Components/Companies/Companies";
import CompanyEdit from "../Components/Companies/CompaniesEdit";
import Customer from "../Components/Customers/Customers";
import CustomerEdit from "../Components/Customers/CustomersEdit";
import Service from "../Components/Services/Services";
import ServiceEdit from "../Components/Services/ServiceEdit";
import Task from "../Components/Tasks/Tasks";
import TeamEdit from "../Components/Teams/TeamEdit";
import Team from "../Components/Teams/Teams";
import User from "../Components/Users/Users";
import UserEdit from "../Components/Users/UserEdit";
import MenuItem from "antd/es/menu/MenuItem";
import Stat from "../Components/Statistics/Statistic";
import Profile from "../Components/Profile/Profile";
import Update from "../Components/Updates/Update";
import UpdateEdit from "../Components/Updates/UpdateEdit";
// @ts-ignore
import taskIcon from "../assets/tasknavicon.png";
// @ts-ignore
import companyIcon from "../assets/companynavicon.png";
// @ts-ignore
import serviceIcon from "../assets/servicenavicon.png";
// @ts-ignore
import teamIcon from "../assets/teamnavicon.png";
// @ts-ignore
import statisticIcon from "../assets/statnavicon.png";
// @ts-ignore
import updateIcon from "../assets/updatenavicon.png";
// @ts-ignore
import userIcon from "../assets/usernavicon.png";
// @ts-ignore
import driverIcon from "../assets/customersIcon.png";
// @ts-ignore
import requestIcon from "../assets/requestIcon.png";
// @ts-ignore
import callIcon from "../assets/callIcon.png";
import Requests from "../Components/Requests/Requests";
import Call from "../Components/CallRequests/Call";
const loc: any = localStorage.getItem("user");
const role = JSON.parse(loc)?.role;

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

export const allMenu: MenuItem[] = [
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
      <Link to="call/">Call Requests</Link>,
      "call/",
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
      <Link to="call/">Call Requests</Link>,
      "call/",
      <img alt="" src={callIcon} />
    )
  );
}

type TItems = {
  path: string;
  component: JSX.Element;
  key: string;
};

export const mainItems: TItems[] = [
  {
    path: "/companies/",
    component: <Company />,
    key: "/companies/",
  },
  {
    path: "/companies/:id",
    component: <CompanyEdit />,
    key: "/company/:id",
  },
  {
    path: "/customers/",
    component: <Customer />,
    key: "/customers/",
  },
  {
    path: "/customers/:id/",
    component: <CustomerEdit />,
    key: "/cusotmer/:id/",
  },
  {
    path: "/services/",
    component: <Service />,
    key: "/services/",
  },
  {
    path: "/services/:id/",
    component: <ServiceEdit />,
    key: "/service/:id/",
  },
  {
    path: "/",
    component: <Task />,
    key: "tasks",
  },
];

export const superItems: TItems[] = [
  {
    path: "/teams/",
    component: <Team />,
    key: "/teams/",
  },
  {
    path: "/teams/:id/",
    component: <TeamEdit />,
    key: "/team/:id/",
  },
  {
    path: "/users/",
    component: <User />,
    key: "/users/",
  },
  {
    path: "/users/:id/",
    component: <UserEdit />,
    key: "/user/:id/",
  },
  {
    path: "/stats/",
    component: <Stat />,
    key: "/stats/",
  },
  {
    path: "/profile/",
    component: <Profile />,
    key: "/profile/",
  },
  {
    path: "/updates/",
    component: <Update />,
    key: "/updates/",
  },
  {
    path: "/updates/:id/",
    component: <UpdateEdit />,
    key: "/update/:id/",
  },
  {
    path: "/requests/",
    component: <Requests />,
    key: "/requests/",
  },
  {
    path: "/call/",
    component: <Call />,
    key: "/call/",
  },
];
