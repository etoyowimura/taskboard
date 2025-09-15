export type TProfile = {
  id: number;
  username: string;
  team: null;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

export type TMystats = {
  daily_stats: Array<object>;
  total_for_period: number;
  avg_stats_for_period: number;
  period: number;
  contribution: number;
};

export type TMyTaskHistory = {
  id: number;
  task: number;
  user: string;
  action: string;
  description: string;
  timestamp: Date;
};

export interface CurrentMonth {
  username: string;
  salary_type: string;
  salary_base_amount: number;
  employee_id: number;
  full_name: string;
  team_name: string;
  number_of_tasks: number;
  total_points: number;
  total_bonuses: number;
  total_charges: number;
  performance_salary: number;
  role: string;
  salary: number;
  month: string;
}

export interface Total {
  id: number;
  username: string;
  salary_type: string;
  full_name: string;
  team_name: string;
  role: string;
  total_bonuses: number;
  total_charges: number;
  total_base_salary: number;
  total_performance_salary: number;
  total_earned_points: number;
  total_number_of_tasks: number;
  total_earned_salary: number;
  salary_months_count: number;
}

export interface SalaryHistory {
  id: number;
  month: string;
  year: number;
  number_of_tasks: number;
  total_points: number;
  total_bonuses: string;
  total_charges: string;
  salary_type: string;
  base_salary: string;
  performance_salary: string;
  total_salary: string;
  salary_document_path: string | null;
}

export interface MySalaryResponse {
  current_month: CurrentMonth;
  total: Total;
  salary_history: SalaryHistory[];
}
