import Company from "../Components/Companies/Companies";
import CompanyEdit from "../Components/Companies/CompaniesEdit";
import Customer from "../Components/Customers/Customers";
import CustomerEdit from "../Components/Customers/CustomersEdit";
import Service from "../Components/Services/Services";
import ServiceEdit from "../Components/Services/ServiceEdit";
import TeamEdit from "../Components/Teams/TeamEdit";
import Team from "../Components/Teams/Teams";
import User from "../Components/Users/Users";
import UserEdit from "../Components/Users/UserEdit";
import Stat from "../Components/Statistics/Statistic";
import Profile from "../Components/Profile/Profile";
import Update from "../Components/Updates/Update";
import UpdateEdit from "../Components/Updates/UpdateEdit";

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
];
