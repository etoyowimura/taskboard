import {
  TAccounting,
  TAccountingHistory,
} from "../../types/Accounting/TAccounting";
import instance from "../api";

export type TAccountingGetParams = {
  month: string;
  search?: string;
  team?: string;
};
export type TAccountingHistoryGetParams = {
  search?: string;
  team?: string;
};

export const AccountingController = {
  async read(filterObject: TAccountingGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.month) params.month = filterObject.month;

    const { data } = await instance.get<TAccounting[]>(`/employees-salaries/`, {
      params,
    });
    return data;
  },
  async history(filterObject: TAccountingHistoryGetParams) {
    const params = { ...filterObject };
    if (!!filterObject.search) params.search = filterObject.search;
    if (!!filterObject.team) params.team = filterObject.team;

    const { data } = await instance.get<TAccountingHistory[]>(
      `/employees-salaries-history/`,
      {
        params,
      }
    );
    return data;
  },
};
