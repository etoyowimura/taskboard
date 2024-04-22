import { message } from "antd";
import { TRequests } from "../../types/Requests/TRequests";
import instance from "../api";

export type TRequestsGetParams = {
  search?: string;
  status?: string;
};

export const requestsController = {
  async read(filterObject: TRequestsGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.search) params.search = filterObject.search;
    if (!!filterObject.status) params.status = filterObject.status;

    const { data } = await instance.get<TRequests[]>(`driver-requests/`, {
      params,
    });
    return data;
  },

  async requestsOne(Id: string | number | undefined) {
    const { data }: { data: any } = await instance(`driver-request/${Id}/`);
    return data;
  },

  async requestPatch(obj: TRequestsGetParams, id: string | number | undefined) {
    const { data } = await instance
      .put<TRequests>(`driver-request/${id}/`, obj)
      .then((u) => {
        setTimeout(() => {
          message.success({ content: "Loaded!", duration: 2 });
        }, 1000);
        return u;
      });
    return data;
  },

  async delete(id: string | number | undefined) {
    let res;
    let error = "";
    try {
      const { data } = await instance
        .patch(`driver-request/${id}/`, { status: "Rejected" })
        .then((u) => {
          setTimeout(() => {
            message.success({ content: "Rejected!", key: id, duration: 2 });
          }, 1000);
          return u;
        });
      res = data;
    } catch (err) {
      error = "Oops something went wrong!";
    }
    return { data: res, error };
  },
};
