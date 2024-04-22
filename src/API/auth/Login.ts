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
    console.log(data);

    const userObject = {
      id: data?.data?.id,
      first_name: data?.data?.first_name,
      last_name: data?.data?.last_name,
      username: data?.data?.username,
      timezone: data?.data?.timezone,
      role: data?.data?.role,
      team_id: data?.data?.team_id,
    };

    const userJSON = JSON.stringify(userObject);
    localStorage.setItem("user", userJSON);
    localStorage.setItem("access", data?.data.access);
    localStorage.setItem("refresh", data?.data.refresh);
    localStorage.setItem("admin_id", data?.data.id);
    document.location.replace("/");
  } catch (err) {
    setTimeout(() => {
      message.error({
        content: "Username or password incorrect!",
        duration: 2,
      });
    }, 1000);
  }
};
