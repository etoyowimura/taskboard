export type TCustomer = {
  id: number;
  name: string;
  company_id: number;
  company: { name: string; id: string };
  is_active: boolean;
  telegram_id: string;
};
