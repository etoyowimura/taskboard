import { useQuery } from "react-query";
import { serviceController } from "../../API/LayoutApi/services";

export const useServiceData = (page?: number, page_size?: number) => {
  return useQuery(
    [`services/`, page, page_size],
    () => serviceController.read(page, page_size),
    { refetchOnWindowFocus: false }
  );
};

export const useServiceOne = (serviceId: number | undefined) => {
  return useQuery(
    [`service/${serviceId || "all"}`, serviceId],
    () => serviceController.serviceOne(serviceId),
    { refetchOnWindowFocus: false }
  );
};
