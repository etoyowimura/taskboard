import { TCustomer } from "../Customer/TCustomer";

export type TRequests = {
  id: number;
  company_name: string;
  full_name: string;
  telegram_id: string;
  company_usdot: string;
  potential_driver: null | TCustomer;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  telegram_user_link: string;
};
