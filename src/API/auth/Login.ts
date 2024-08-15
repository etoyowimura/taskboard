import instance from "../api";
import { message } from "antd";

interface loginInterface {
  username: string;
  password: string | number;
}

export const LoginApi = async ({ username, password }: loginInterface) => {
  try {
    const { data } = await instance("auth/login/", {
      method: "POST",
      data: { username, password },
      headers: { "Content-Type": "application/json" },
    });
    const userObject = {
      id: data?.data?.id,
      first_name: data?.data?.first_name,
      last_name: data?.data?.last_name,
      username: data?.data?.username,
      email: data?.data?.email,
      role: data?.data?.role,
      team: data?.data?.team,
      business: data?.data?.business,
      timezone: data?.data?.timezone || data?.data?.business?.timezone,
    };

    const userJSON = JSON.stringify(userObject);
    localStorage.setItem("user", userJSON);
    localStorage.setItem("username", data?.data?.username);
    localStorage.setItem("access", data?.data.access);
    localStorage.setItem("refresh", data?.data.refresh);
    localStorage.setItem("admin_id", data?.data.id);
    document.location.replace("/");
  } catch (err: any) {
    setTimeout(() => {
      message.error({
        content: err?.response?.data
          ? err?.response?.data?.message
          : "Username or password incorrect!!!",
        duration: 8,
      });
    }, 1000);
  }
};
