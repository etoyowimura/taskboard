import { useQuery } from "react-query";
import {
  requestsController,
  TRequestsGetParams,
} from "../../API/LayoutApi/requests";

export const useRequestsData = ({ search, status }: TRequestsGetParams) => {
  return useQuery(
    [`driver-requests/`, { search, status }],
    () => requestsController.read({ search, status }),
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
