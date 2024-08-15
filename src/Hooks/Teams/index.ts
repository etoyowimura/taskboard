import { useQuery } from "react-query";
import { TTeamGetParams, teamController } from "../../API/LayoutApi/teams";

export const useTeamData = ({ name, company_id }: TTeamGetParams) => {
  return useQuery(
    [`teams`, name, company_id],
    () => teamController.read({ name, company_id }),
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
