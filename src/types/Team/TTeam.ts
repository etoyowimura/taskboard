export type TTeam = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: Date;
  task_count_percentage: number;
  task_count?: number;
};
