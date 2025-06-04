import { useQuery } from "react-query";
import {
  AccountingController,
  TAccountingConfirmedMonthsParams,
  TAccountingGetParams,
  TAccountingHistoryGetParams,
} from "../../API/LayoutApi/accounting";
import { TAccountingConfirmedMonths } from "../../types/Accounting/TAccounting";

export const useAccountingData = ({
  month,
  search,
  team,
  page,
  page_size,
  role,
  salary_type,
}: TAccountingGetParams) => {
  return useQuery(
    [
      `/employees-salaries`,
      month,
      search,
      team,
      page,
      page_size,
      role,
      salary_type,
    ],
    () =>
      AccountingController.read({
        month,
        search,
        team,
        page,
        page_size,
        role,
        salary_type,
      }),
    { refetchOnWindowFocus: false }
  );
};

export const useAccountingHistory = ({
  search,
  team,
  page,
  page_size,
  role,
  salary_type,
}: TAccountingHistoryGetParams) => {
  return useQuery(
    [
      `/employees-salaries-history/`,
      search,
      team,
      page,
      page_size,
      role,
      salary_type,
    ],
    () =>
      AccountingController.history({
        search,
        team,
        page,
        page_size,
        role,
        salary_type,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useConfirmedMonths = ({
  page,
  page_size,
}: TAccountingConfirmedMonthsParams) => {
  return useQuery(
    [`/salaries-group`, page, page_size],
    () => AccountingController.confirmedMonths({ page, page_size }),
    {
      refetchOnWindowFocus: false,
    }
  );
};
