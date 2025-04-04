import { useQuery } from "react-query";
import {
  AccountingController,
  TAccountingGetParams,
  TAccountingHistoryGetParams,
} from "../../API/LayoutApi/accounting";

export const useAccountingData = ({
  month,
  search,
  team,
}: TAccountingGetParams) => {
  return useQuery(
    [`/employees-salaries`, month, search, team],
    () =>
      AccountingController.read({
        month,
        search,
        team,
      }),
    { refetchOnWindowFocus: false }
  );
};

export const useAccountingHistory = ({
  search,
  team,
}: TAccountingHistoryGetParams) => {
  return useQuery(
    [`/employees-salaries-history/`, search, team],
    () => AccountingController.history({ search, team }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useConfirmedMonths = () => {
  return useQuery(
    [`/salaries-group`],
    () => AccountingController.confirmedMonths(),
    {
      refetchOnWindowFocus: false,
    }
  );
};
