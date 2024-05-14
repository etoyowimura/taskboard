export type TUser = {
    id:           number;
    username:     string;
    team: {id: number, name: string}
    role: {id: number, name: string}
    first_name:   string | '';
    last_name:    string | '';
    is_active:    boolean;
    is_superuser: boolean;
}