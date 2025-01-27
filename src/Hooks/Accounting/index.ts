import { useQuery } from "react-query";
import {
  AccountingController,
  TAccountingGetParams,
} from "../../API/LayoutApi/accounting";

export const useAccountingData = ({ month }: TAccountingGetParams) => {
  return useQuery(
    [`stats/all-users/`, month],
    () =>
      AccountingController.read({
        month,
      }),
    { refetchOnWindowFocus: false }
  );
};

export const useAccountingHistory = () => {
  return useQuery(
    [`employees-salaries-history/`],
    () => AccountingController.history(),
    {
      refetchOnWindowFocus: false,
    }
  );
};
