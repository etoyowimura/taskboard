export type TStat = {
  id: number;
  full_name: string;
  username: string;
  team_id: number | null;
  total_points: number;
  for_salary: boolean;
};
export type TStatTeam = {
  id: number;
  name: string;
  is_active: boolean;
  total_points: number;
};

export type TStatCreators = {
  id: number;
  username: string;
  full_name: string;
  number_of_tasks: number;
};

type TaskPerformance = {
  number_of_tasks: number;
  total_points: number;
};
export type TteamChartData = {
  date: string;
  [category: string]: TaskPerformance | string;
};

export type TCard = {
  all_tasks: number;
  active_tasks: number;
  active_tasks_percentage: number;
  inactive_tasks: number;
  inactive_tasks_percentage: number;
};

export type TGeneralChartGetParams = {
  start_date: string;
  end_date: string;
};

export type TDailyStat = {
  task_date: string;
  total_tasks: number;
  completed_tasks: number;
  incomplete_tasks: number;
};

export type TSummaryData = {
  total: number;
  total_completed: number;
  total_incomplete: number;
};

export type TGeneralChartData = {
  daily_stats: TDailyStat[];
  summary: TSummaryData;
};
