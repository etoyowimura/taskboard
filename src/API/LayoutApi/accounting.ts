import instance from "../api";

export type TAccountingConfirmedMonthsParams = {
  page?: number;
  page_size?: number;
};

export type TAccountingGetParams = {
  month: string;
  search?: string;
  team?: string;
  page?: number;
  page_size?: number;
  role?: number;
  salary_type?: string;
};
export type TAccountingHistoryGetParams = {
  search?: string;
  team?: string;
  page?: number;
  page_size?: number;
  role?: number;
  salary_type?: string;
};

export const AccountingController = {
  async read(filterObject: TAccountingGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.month) params.month = filterObject.month;

    const { data } = await instance.get(`/employees-salaries/`, {
      params,
    });
    return data;
  },

  async confirmedMonths(filterObject: TAccountingConfirmedMonthsParams) {
    const { data } = await instance.get(`/salaries-group/`, {
      params: filterObject,
    });
    return data;
  },

  async history(filterObject: TAccountingHistoryGetParams) {
    const params = { ...filterObject };
    if (!!filterObject.search) params.search = filterObject.search;
    if (!!filterObject.team) params.team = filterObject.team;
    if (!!filterObject.page) params.page = filterObject.page;
    if (!!filterObject.team) params.page_size = filterObject.page_size;

    const { data } = await instance.get(`/employees-salaries-history/`, {
      params,
    });
    return data;
  },
};
