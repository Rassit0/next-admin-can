"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface Coach {
  id: string;
  name: string;
}

export interface MatchTeamContextData {
  teamSeasonCategoryId: string;
  isExternal: boolean;
  defaultCoach: Coach | null;
  eligibleCoaches: Coach[];
}

export const getMatchTeamContext = async (
  teamSeasonCategoryId: string,
  matchDate: string,
): Promise<ServiceResponse<MatchTeamContextData>> => {
  return handleServerAction(async () => {
    const query = new URLSearchParams({
      teamSeasonCategoryId,
      matchDate,
    }).toString();

    const res = await api.get<{ message: string; data: MatchTeamContextData }>(
      `matches/team-context?${query}`,
    );

    return {
      error: false,
      data: res.data,
      message: res.message,
    };
  });
};
