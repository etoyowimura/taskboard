import {
  TAccounting,
  TAccountingHistory,
} from "../../types/Accounting/TAccounting";
import instance from "../api";

export type TAccountingGetParams = {
  month: string;
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
  async history() {
    const { data } = await instance.get<TAccountingHistory[]>(
      `/employees-salaries-history/`
    );
    return data;
  },
};
