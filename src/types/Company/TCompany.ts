export type TCompany = {
  id: number;
  name: string;
  source: string;
  owner: string;
  is_active: boolean;
  usdot: string;
  team: { name: string; id: number };
  api_key: string;
  created_at: Date;
};
