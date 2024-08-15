import { useQuery } from "react-query";
import {
  TCustomerGetParams,
  customerController,
} from "../../API/LayoutApi/customers";

export const useCustomerData = ({
  name,
  page,
  is_active,
  page_size,
  for_driver_request,
}: TCustomerGetParams) => {
  return useQuery(
    [`customers/`, name, page, is_active, page_size, for_driver_request],
    () =>
      customerController.read({
        name,
        page,
        is_active,
        page_size,
        for_driver_request,
      }),
    { refetchOnWindowFocus: false }
  );
};

export const useCustomerByComanyData = (
  obj: TCustomerGetParams,
  id?: number
) => {
  return useQuery(
    [`customers-by-company/${id}`, obj],
    () => customerController.customerByCompany(obj, id),
    { refetchOnWindowFocus: false }
  );
};

export const useCustomerOne = (Id: number | undefined) => {
  return useQuery(
    [`customer/${Id}/`, Id],
    () => customerController.customerOne(Id),
    { refetchOnWindowFocus: false }
  );
};
