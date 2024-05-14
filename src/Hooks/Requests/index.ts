import { useQuery } from "react-query";
import {
  requestsController,
  TRequestsGetParams,
} from "../../API/LayoutApi/requests";

export const useRequestsData = ({
  search,
  status,
  page,
  page_size,
  for_driver_request,
}: TRequestsGetParams) => {
  return useQuery(
    [
      `driver-requests/`,
      { search, status, page, page_size, for_driver_request },
    ],
    () =>
      requestsController.read({
        search,
        status,
        page,
        page_size,
        for_driver_request,
      }),
    { refetchOnWindowFocus: false }
  );
};

export const useRequestsOne = (userId: number | string | undefined): any => {
  return useQuery(
    [`driver-requests/${userId || "all"}`, userId],
    () => requestsController.requestsOne(userId),
    { refetchOnWindowFocus: false }
  );
};
