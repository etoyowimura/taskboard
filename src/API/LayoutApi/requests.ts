import { message } from "antd";
import { TRequests } from "../../types/Requests/TRequests";
import instance from "../api";
import { TPagination } from "../../types/common/TPagination";

export type TRequestsGetParams = {
  search?: string;
  status?: string;
  for_driver_request?: boolean;
  page?: number;
  page_size?: number;
};

export const requestsController = {
  async read(filterObject: TRequestsGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.search) params.search = filterObject.search;
    if (!!filterObject.status) params.status = filterObject.status;
    if (!!filterObject.page) params.page = filterObject.page;
    if (!!filterObject.page_size) params.page_size = filterObject.page_size;
    if (!!filterObject.for_driver_request)
      params.for_driver_request = filterObject.for_driver_request;

    const { data } = await instance.get<TPagination<TRequests[]>>(
      `driver-requests/`,
      {
        params,
      }
    );
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
  async rejectPatch(obj: TRequestsGetParams, id: string | number | undefined) {
    const { data } = await instance
      .patch<TRequests>(`driver-request/${id}/`, obj)
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
        .delete(`driver-request/${id}/`)
        .then((u) => {
          setTimeout(() => {
            message.success({ content: "Deleted!", key: id, duration: 2 });
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
