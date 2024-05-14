import { TCustomer } from "../../types/Customer/TCustomer";
import { TPagination } from "../../types/common/TPagination";
import instance from "../api";
import { message } from "antd";

export type TCustomerGetParams = {
  name?: string;
  page_size?: string | number;
  page?: string | number;
  for_driver_request?: boolean;
  is_active?: boolean;
};
export type TCustomerByCompanyGetParams = {
  name?: string;
  id?: number;
  for_driver_request?: boolean;
};
export type TCustomerPutParams = {
  name?: string;
  company_id?: number;
};
export type TCustomerPostParams = {
  name?: string;
  company_id?: number;
  is_active?: boolean;
};

export const customerController = {
  async read(filterObject: TCustomerGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.name) params.name = filterObject.name;
    if (!!filterObject.is_active) params.is_active = filterObject.is_active;
    if (!!filterObject.page) params.page = filterObject.page;
    if (!!filterObject.page_size) params.page_size = filterObject.page_size;
    if (!!filterObject.for_driver_request)
      params.for_driver_request = filterObject.for_driver_request;

    const { data } = await instance.get<TPagination<TCustomer[]>>(
      `customers/`,
      { params }
    );
    return data;
  },

  async customerOne(Id: number | undefined) {
    if (Id) {
      const { data } = await instance.get<TCustomer>(`customer/${Id}/`);
      return data;
    }
  },

  async customerByCompany(
    id: number | undefined,
    name: string | undefined,
    for_driver_request?: boolean
  ) {
    const params = { name, for_driver_request };
    if (!!name) params.name = name;
    if (!!for_driver_request) params.for_driver_request = for_driver_request;
    if (id) {
      const { data } = await instance.get<TCustomer[]>(
        `customers-by-company/${id}/`,
        { params }
      );
      return data;
    }
  },

  async customerPatch(obj: TCustomerPutParams, id: string) {
    const { data }: { data: any } = await instance
      .put<TCustomer>(`customer/${id}/`, obj)
      .then((u) => {
        setTimeout(() => {
          message.success({ content: "Loaded!", duration: 2 });
        }, 1000);
        return u;
      });
    return data;
  },

  async addCustomerController(obj: TCustomerPostParams) {
    message.loading({ content: "Loading..." });
    const { data } = await instance
      .post<TCustomer>("customer/", obj)
      .then((u) => {
        setTimeout(() => {
          message.success({ content: "Loaded!", duration: 2 });
        }, 1000);
        return u;
      });
    return data;
  },

  async deleteCustomerController(id: string) {
    message.loading({ content: "Loading..." });
    let res;
    let error = "";
    try {
      const { data } = await instance.delete(`customer/${id}/`).then((u) => {
        setTimeout(() => {
          message.success({ content: "Deleted!", duration: 2 });
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
