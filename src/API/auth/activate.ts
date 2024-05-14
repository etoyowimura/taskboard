import instance from "../api";
import { message } from "antd";

export interface activateInterface {
  user_id: string;
  confirmation_token: string;
}
export interface inviteInterface {
  user_id: string;
  confirmation_token: string;
  role_id: string | null;
  business_id: string | null;
}

export const registryVerify = async (value: activateInterface) => {
  try {
    const { data, status } = await instance("users/verify-registration/", {
      method: "POST",
      data: value,
      headers: { "Content-Type": "application/json" },
    });
    const userObject = {
      first_name: data?.data.first_name,
      last_name: data?.data.last_name,
      username: data?.data.username,
      id: data?.data.id,
      timezone: data?.data.timezone,
      role: data?.data.role,
    };
    console.log(data);
    

    const userJSON = JSON.stringify(userObject);
    localStorage.setItem("user", userJSON);
    localStorage.setItem("access", data?.data.access);
    localStorage.setItem("refresh", data?.data.refresh);
    document.location.replace("/");

    return status;
  } catch (error) {
    setTimeout(() => {
      message.error({ content: "Something went wrong", duration: 2 });
    }, 1000);
  }
};

export const inviteVerify = async (value: inviteInterface) => {
  try {
    const { data, status } = await instance("users/invite-verify/", {
      method: "POST",
      data: value,
      headers: { "Content-Type": "application/json" },
    });
    const userObject = {
      first_name: data?.data.first_name,
      last_name: data?.data.last_name,
      username: data?.data.username,
      id: data?.data.id,
      timezone: data?.data.timezone,
      role: data?.data.role,
    };

    const userJSON = JSON.stringify(userObject);
    localStorage.setItem("user", userJSON);
    localStorage.setItem("access", data?.data.access);
    localStorage.setItem("refresh", data?.data.refresh);
    localStorage.setItem("admin_id", data?.data.id);
    instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data?.data.access}`;
    return status;
  } catch (error) {
    setTimeout(() => {
      message.error({ content: "Something went wrong", duration: 2 });
    }, 1000);
  }
};
