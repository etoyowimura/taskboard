import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  TTeamGetParams,
  UpdateTeamMonitorVars,
  teamController,
} from "../../API/LayoutApi/teams";

export const useTeamData = ({
  name,
  company_id,
  page,
  page_size,
}: TTeamGetParams) => {
  return useQuery(
    [`teams`, name, company_id, page, page_size],
    () => teamController.read({ name, company_id, page, page_size }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useTeamOne = (teamId: number | string | undefined): any => {
  return useQuery(
    [`team/${teamId || "all"}`, teamId],
    () => teamController.teamOne(teamId),
    { refetchOnWindowFocus: false }
  );
};

// Team monitor

export const useTeamsMonitorData = ({
  name,
  page,
  page_size,
}: TTeamGetParams) => {
  return useQuery(
    ["teams-monitor", name, page, page_size],
    () => teamController.readTeamsMonitor({ name, page, page_size }),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useCreateTeamMonitor = () => {
  const queryClient = useQueryClient();

  return useMutation(teamController.createTeamMonitor, {
    onSuccess: () => {
      queryClient.invalidateQueries("teams-monitor");
    },
    onError: (error) => {
      console.error("Failed to create team monitor:", error);
    },
  });
};

export const useTeamsMonitorGetOne = (id: any) => {
  return useQuery(["teams-monitor"], () => teamController.readTeamsGetOne(id), {
    refetchOnWindowFocus: false,
  });
};

export const useDeleteTeamMonitor = () => {
  const queryClient = useQueryClient();

  return useMutation(teamController.deleteTeamMonitor, {
    onSuccess: () => {
      queryClient.invalidateQueries("teams-monitor");
    },
    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });
};

export const useUpdateTeamMonitor = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, payload }: UpdateTeamMonitorVars) =>
      teamController.updateTeamMonitor(id, payload),

    {
      onSuccess: () => {
        queryClient.invalidateQueries("teams-monitor");
      },
      onError: (error) => {
        console.error("Update team monitor failed:", error);
      },
    }
  );
};
