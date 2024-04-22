import { TCard, TStat, TStatTeam } from "../../types/Statistic/TStat";
import instance from "../api";

export type TStatGetParams = {
  search?: string;
  team?: string;
  start_date?: string;
  end_date?: string;
};

export type TStatTeamGetParams = {
  search?: string;
  start_date?: string;
  end_date?: string;
};

export type TStatCreatorsGetParams = {
  start_date?: string;
  end_date?: string;
};

export const statController = {
  async read(filterObject: TStatGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.search) params.search = filterObject.search;
    if (!!filterObject.team) params.team = filterObject.team;
    if (!!filterObject.start_date) params.start_date = filterObject.start_date;
    if (!!filterObject.end_date) params.end_date = filterObject.end_date;

    const { data } = await instance.get<TStat[]>(`stats/all-users/`, {
      params,
    });
    return data;
  },

  async team(filterObject: TStatTeamGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.search) params.search = filterObject.search;
    if (!!filterObject.start_date) params.start_date = filterObject.start_date;
    if (!!filterObject.end_date) params.end_date = filterObject.end_date;

    const { data } = await instance.get<TStatTeam[]>(`stats/all-teams/`, {
      params,
    });
    return data;
  },

  async creators(filterObject: TStatCreatorsGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.start_date) params.start_date = filterObject.start_date;
    if (!!filterObject.end_date) params.end_date = filterObject.end_date;

    const { data } = await instance.get<TStatTeam[]>(`stats/task-creators/`, {
      params,
    });
    return data;
  },
  async cards(filterObject: TStatCreatorsGetParams) {
    const params = { ...filterObject };

    if (!!filterObject.start_date) params.start_date = filterObject.start_date;
    if (!!filterObject.end_date) params.end_date = filterObject.end_date;

    const { data } = await instance.get<TCard>(`stats/tasks-comparison/`, {
      params,
    });
    return data;
  },

  async saveUsersStats(
    fileName: string,
    startDate: string,
    endDate: string,
    team: string
  ) {
    const response = await instance.post(
      `stats/all-users/?start_date=${startDate}&end_date=${endDate}&team=${team}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Disposition": `attachment;`,
        },
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadUrl;
    a.download = `stats_${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    return response.data;
  },

  async saveTeamStats(fileName: string, startDate: string, endDate: string) {
    const response = await instance.post(
      `stats/all-teams/?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Disposition": `attachment;`,
        },
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadUrl;
    a.download = `stats_${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    return response.data;
  },

  async statOne(Id: string | number | undefined) {
    const { data } = await instance.get<TStat>(`stats/${Id}`);
    return data;
  },
};
