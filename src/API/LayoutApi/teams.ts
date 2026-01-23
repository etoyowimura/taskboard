import { TTeam } from "../../types/Team/TTeam";
import instance from "../api";
import { message } from "antd";

export type TTeamGetParams = {
  page?: number;
  page_size?: number;
  name?: string;
  company_id?: string | number;
};

export type TTeamPutParams = {
  name?: string;
  is_active?: boolean;
};

export type TTeamPostParams = {
  name?: string;
  is_active?: boolean;
};

export interface TeamMonitorCreatePayload {
  name: string;
  company_ids: number[];
}

export interface TeamMonitorUpdatePayload {
  name?: string;
  is_active?: boolean;
}

export interface UpdateTeamMonitorVars {
  id: string;
  payload: {
    name?: string;
    is_active?: boolean;
    company_ids?: any[];
  };
}

export interface UpdateTeamMonitorCompaniesVars {
  id: string;
  payload: {
    company_ids: number[];
  };
}

export const teamController = {
  async read(obj: TTeamGetParams) {
    const params = { ...obj };

    if (!!obj.company_id) params.company_id = obj.company_id;
    if (!!obj.name) params.name = obj.name;
    if (!!obj.page) params.page = obj.page;
    if (!!obj.page_size) params.page_size = obj.page_size;

    const { data } = await instance.get(`teams/`, {
      params,
    });
    return data;
  },

  async teamOne(Id: string | number | undefined) {
    const { data } = await instance.get<TTeam>(`team/${Id}`);
    return data;
  },

  async teamPatch(obj: TTeamPutParams, id: string) {
    const { data } = await instance.put<TTeam>(`team/${id}/`, obj).then((u) => {
      setTimeout(() => {
        message.success({ content: "Loaded!", duration: 2 });
      }, 1000);
      return u;
    });
    return data;
  },

  async addTeamController(obj: TTeamPostParams) {
    try {
      const { data } = await instance.post<TTeam>("team/", obj).then((u) => {
        setTimeout(() => {
          message.success({ content: "Loaded!", duration: 2 });
        }, 1000);
        return u;
      });
      return data;
    } catch (error: any) {
      setTimeout(() => {
        message.error({
          content: error?.response?.data?.name,
          key: 2,
          duration: 2,
        });
      }, 1000);
      return null;
    }
  },

  async deleteTeamController(id: string) {
    let res;
    let error = "";
    try {
      const { data } = await instance.delete(`team/${id}`).then((u) => {
        setTimeout(() => {
          message.success({ content: "Deleted!", duration: 2 });
        }, 1000);
        return u;
      });
      res = data;
    } catch (err) {
      error = "Oops something went wrong!";
    }
    return { data: res, error };
  },
  //  Team Monitoring

  async readTeamsMonitor(obj: TTeamGetParams) {
    const params: any = {};

    if (obj.page) params.page = obj.page;
    if (obj.page_size) params.page_size = obj.page_size;
    if (obj.name) params.name = obj.name;

    const { data } = await instance.get("/teams-monitor/", {
      params,
    });

    return data;
  },

  async createTeamMonitor(payload: TeamMonitorCreatePayload) {
    const { data } = await instance.post("/team-monitor/", payload);
    return data;
  },

  async readTeamsGetOne(id: any) {
    const { data } = await instance.get(`/team-monitor/${id}/`);

    return data;
  },

  async deleteTeamMonitor(id: string) {
    try {
      const { data } = await instance.delete(`/team-monitor/${id}`);
      return data;
    } catch (err) {
      throw new Error("Oops something went wrong!");
    }
  },
  async updateTeamMonitor(id: string, payload: TeamMonitorUpdatePayload) {
    try {
      const { data } = await instance.put(`/team-monitor/${id}/`, payload);
      return data;
    } catch (error) {
      throw new Error("Failed to update team monitor");
    }
  },
  async updateTeamMonitorCompanies(
    id: string,
    payload: { company_ids: number[] },
  ) {
    try {
      const { data } = await instance.put(
        `/team-monitor/${id}/companies/`,
        payload,
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Something went wrong";

      message.error(errorMessage);

      throw error;
    }
  },
};
