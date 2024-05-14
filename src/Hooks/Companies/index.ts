import { useQuery } from "react-query";
import {
  TCompanyGetParams,
  companyController,
} from "../../API/LayoutApi/companies";

export const useCompanyData = ({
  name,
  page,
  is_active,
}: TCompanyGetParams) => {
  return useQuery(
    [`companies/`, name, page, is_active],
    () => companyController.read({ name, page, is_active }),
    { refetchOnWindowFocus: false }
  );
};
export const useCompanyPaginated = ({
  name,
  page,
  is_active,
  page_size,
}: TCompanyGetParams) => {
  return useQuery(
    [`companies/`, name, page, is_active, page_size],
    () => companyController.readPaginated({ name, page, is_active, page_size }),
    { refetchOnWindowFocus: false }
  );
};

export const useCompanyOne = (id: number | undefined) => {
  return useQuery(
    [`company/${id}/`, id],
    () => companyController.companyOne(id),
    { refetchOnWindowFocus: false }
  );
};
