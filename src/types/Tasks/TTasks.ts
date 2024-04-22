type data = {
  id: number;
  name?: string;
  title?: string;
  username?: string;
};

export type TTask = {
  id: number;
  note: string;
  status: string;
  is_active: boolean;
  pti: boolean;
  created_at: string;
  updated_at: string;
  business: AssignedTo;
  company: Company;
  customer: AssignedTo;
  service: Service;
  assigned_to: AssignedTo;
  in_charge: InCharge;
  forwarded_from: { id: number; name: string };
  attachment_set: any[];
};

export interface AssignedTo {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  source: string;
}

export interface Service {
  id: number;
  title: string;
}
export interface InCharge {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

export type AttachmentSet = {
  id?: number;
  uploaded_by?: number | null;
  created_at?: string;
  updated_at?: string;
  file_path?: string;
  file_name?: string;
};

export type TTaskHistory = {
  id?: number;
  task?: number;
  driver?: {
    name?: string;
    id: number;
  };
  user?: {
    username?: string;
    id: number;
    first_name?: string;
    last_name?: string;
  };
  action?: string;
  description?: string;
  timestamp?: Date;
};
