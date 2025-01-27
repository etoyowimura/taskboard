export type TAccounting = {
  full_name: string;
  is_confirmed: boolean;
  id: number;
  number_of_tasks: number;
  performance_based_amount: string;
  salary: string;
  salary_base_amount: string;
  salary_type: string;
  total_bonuses: string;
  total_charges: string;
  total_points: number;
  username: string;
};

export type TAccountingHistory = {
  id: number;
  full_name: string;
  username: string;
  total_number_of_tasks: number;
  salary_type: string;
  total_bonuses: string;
  total_charges: string;
  total_earned_points: string;
  total_base_salary: string;
  total_performance_salary: string;
  total_earned_salary: string;
};
