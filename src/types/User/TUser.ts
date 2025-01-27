export type TUser = {
    id:           number;
    username:     string;
    team: {id: number, name: string}
    role: {id: number, name: string}
    first_name:   string | '';
    last_name:    string | '';
    is_active:    boolean;
    is_superuser: boolean;
    salary_type: string;
    salary_base_amount: number;
}

export type TUserResponse = {
  page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  current_time: string;
  data: TUser[];
};