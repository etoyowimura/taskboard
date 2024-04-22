import instance from "../api";
import { message } from "antd";

export const LogoutApi = async () => {
  try {
    await instance("auth/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { refresh_token: localStorage.getItem("refresh") },
    });
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("admin_id");
    document.location.replace("/");
  } catch (err) {
    setTimeout(() => {
      message.error({ content: "Something went wrong! ", duration: 2 });
    }, 1000);
    throw new Error("Something went wrong");
  }
};
