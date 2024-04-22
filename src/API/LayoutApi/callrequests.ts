import { message } from "antd";
import { TCall } from "../../types/CallRequests/TCall";
import instance from "../api";

export const callController = {
  async read(obj: { status: string }) {
    const params = { ...obj };

    if (!!obj.status) params.status = obj.status;

    const { data } = await instance.get<TCall[]>(`callback-requests/`, {
      params,
    });
    return data;
  },

  async callPatch(
    obj: { note?: string; status?: string },
    id: number
  ) {
    const params = { ...obj };
    if (!!obj.note) params.note = obj.note;
    if (!!obj.status) params.status = obj.status;

    const { data }: { data: any } = await instance
      .put<TCall>(`callback-request/${id}/`, params)
      .then((u) => {
        setTimeout(() => {
          message.success({ content: "Loaded!", duration: 2 });
        }, 1000);
        return u;
      });
    return data;
  },
};
