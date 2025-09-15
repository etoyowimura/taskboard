import { useQuery } from "react-query";
import { TMyTaskHistoryGetParams, prof } from "../../API/LayoutApi/profile";
import { MySalaryResponse } from "../../types/Profile/TProfile";

export const useMystatsData = ({
  start_date,
  end_date,
}: TMyTaskHistoryGetParams) => {
  return useQuery(
    [`stats/my-stats/`, start_date, end_date],
    () => prof.read({ start_date, end_date }),
    {
      refetchOnWindowFocus: false,
    }
  );
};
// export const useMystatsData = ({
//   start_date,
//   end_date,
// }: TMyTaskHistoryGetParams) => {
//   return useQuery(
//     [`stats/my-stats/`, start_date, end_date],
//     () => prof.read({ start_date, end_date }),
//     {
//       refetchOnWindowFocus: false,
//     }
//   );
// };

export const useProfData = () => {
  return useQuery([`users/my-profile/`], () => prof.self(), {
    refetchOnWindowFocus: false,
  });
};

export const useMyHistoryData = ({
  start_date,
  end_date,
}: TMyTaskHistoryGetParams) => {
  return useQuery(
    [`my-task-history/`, start_date, end_date],
    () => prof.myTaskHistory({ start_date, end_date }),
    { refetchOnWindowFocus: false }
  );
};

export const useMySalaryData = () => {
  return useQuery<MySalaryResponse>(
    ["users/my-salary"],
    () => prof.mySalary(),
    {
      refetchOnWindowFocus: false,
    }
  );
};
