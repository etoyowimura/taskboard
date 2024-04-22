import { useQuery } from "react-query";
import { callController } from "../../API/LayoutApi/callrequests";

export const useCallData = ({ status }: { status: string }) => {
  return useQuery(
    [`callback-requests/`, { status }],
    () => callController.read({ status }),
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
