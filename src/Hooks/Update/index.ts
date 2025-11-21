import { useQuery } from "react-query";
import { updateController } from "../../API/LayoutApi/update";

// export const useUpdateData = (status: string): any => {
//   return useQuery(
//     [`updates/${status}`, status],
//     () => updateController.read(status),
//     { refetchOnWindowFocus: false }
//   );
// };

export const useUpdateData = (
  status: string,
  page: number | string,
  page_size: number | number,
  company_name: string,
  driver_name: string
) => {
  return useQuery(
    [`shift-updates`, status, page, page_size, company_name, driver_name],
    () =>
      updateController.read(status, page, page_size, company_name, driver_name),
    { refetchOnWindowFocus: false }
  );
};

export const useUpdateOne = (updateId: number | string | undefined): any => {
  return useQuery(
    [`update/${updateId || "all"}`, updateId],
    () => updateController.updateOne(updateId),
    { refetchOnWindowFocus: false }
  );
};
