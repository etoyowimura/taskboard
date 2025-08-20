import {
  TStatCreatorsGetParams,
  TteamChartGetParams,
} from "./../../API/LayoutApi/statistic";
import { useQuery } from "react-query";
import { TStatGetParams, statController } from "../../API/LayoutApi/statistic";
import {
  TGeneralChartData,
  TGeneralChartGetParams,
} from "../../types/Statistic/TStat";

export const useStatsData = ({
  search,
  team,
  start_date,
  end_date,
  for_salary,
  page,
  page_size,
}: TStatGetParams) => {
  return useQuery(
    [
      `stats/all-users/`,
      page,
      page_size,
      search,
      team,
      start_date,
      end_date,
      for_salary,
    ],
    () =>
      statController.read({
        search,
        team,
        start_date,
        end_date,
        for_salary,
        page,
        page_size,
      }),
    { refetchOnWindowFocus: false }
  );
};
export const useStatTeamData = ({
  search,
  start_date,
  end_date,
  page,
  page_size,
}: TStatGetParams) => {
  return useQuery(
    [`stats/all-teams/`, search, start_date, end_date, page_size, page],
    () =>
      statController.team({ search, start_date, end_date, page, page_size }),
    { refetchOnWindowFocus: false }
  );
};

export const useCreatorsData = ({
  page,
  page_size,
  start_date,
  end_date,
  search,
}: TStatCreatorsGetParams) => {
  return useQuery(
    [`stats/task-creators/`, search, start_date, end_date, page, page_size],
    () =>
      statController.creators({
        start_date,
        end_date,
        search,
        page,
        page_size,
      }),
    { refetchOnWindowFocus: false }
  );
};
export const useTeamChartData = ({
  start_date,
  end_date,
}: TteamChartGetParams) => {
  return useQuery(
    [`stats/teams-line-chart/`, start_date, end_date],
    () => statController.teamChart({ start_date, end_date }),
    { refetchOnWindowFocus: false }
  );
};

export const useCardData = ({ start_date, end_date }: TStatGetParams) => {
  return useQuery(
    [`stats/tasks-comparison/`, start_date, end_date],
    () => statController.cards({ start_date, end_date }),
    { refetchOnWindowFocus: false }
  );
};

export const useStatOne = (statId: number | string | undefined): any => {
  return useQuery(
    [`stat/${statId || "all"}`, statId],
    () => statController.statOne(statId),
    { refetchOnWindowFocus: false }
  );
};

export const useGeneralStats = (filterObject: TGeneralChartGetParams) => {
  return useQuery<TGeneralChartData, Error>(
    ["stats/general-stats", filterObject],
    () => statController.generalChart(filterObject),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
