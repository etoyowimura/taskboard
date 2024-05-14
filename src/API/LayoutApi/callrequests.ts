import { message } from "antd";
import { TCall } from "../../types/CallRequests/TCall";
import instance from "../api";
import { TPagination } from "../../types/common/TPagination";

export const callController = {
  async read(obj: { status: string; page: number; page_size: number }) {
    const params = { ...obj };

    if (!!obj.status) params.status = obj.status;
    if (!!obj.page) params.page = obj.page;
    if (!!obj.page_size) params.page_size = obj.page_size;

    const { data } = await instance.get<TPagination<TCall[]>>(
      `callback-requests/`,
      {
        params,
      }
    );
    return data;
  },

  async callPatch(obj: { note?: string; status?: string }, id: number) {
    const params = { ...obj };
    if (!!obj.note) params.note = obj.note;
    if (!!obj.status) params.status = obj.status;

    const { data }: { data: any } = await instance
      .put<TCall>(`callback-request/${id}/`, params)
      .then((u) => {
        setTimeout(() => {
          message.success({ content: "Success!", duration: 2 });
        }, 1000);
        return u;
      });
    return data;
  },
};
