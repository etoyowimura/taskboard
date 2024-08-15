import { TTeam } from "../../types/Team/TTeam";
import instance from "../api";
import { message } from "antd";

export type TTeamGetParams = {
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

export const teamController = {
  async read(obj: TTeamGetParams) {
    const params = { ...obj };

    if (!!obj.company_id) params.company_id = obj.company_id;
    if (!!obj.name) params.name = obj.name;

    const { data } = await instance.get<TTeam[]>(`teams/`, {
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
};
