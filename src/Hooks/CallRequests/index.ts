import { useQuery } from "react-query";
import { callController } from "../../API/LayoutApi/callrequests";

export const useCallData = ({
  status,
  page,
  page_size,
}: {
  status: string;
  page: number;
  page_size: number;
}) => {
  return useQuery(
    [`callback-requests/`, { status, page, page_size }],
    () => callController.read({ status, page, page_size }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

// export const useCompanyOne = (id: number | undefined) => {
//   return useQuery(
//     [`company/${id}/`, id],
//     () => companyController.companyOne(id),
//     { refetchOnWindowFocus: false }
//   );
// };
