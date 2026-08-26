"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ITeamSeasonCategory } from "@/modules/team-seasons";
import { handleServerAction } from "@/utils";

export const getTeamSeasonCategories = async (
  teamSeasonId: string,
): Promise<ServiceResponse<ITeamSeasonCategory[]>> => {
  return handleServerAction(async () => {
    const response = await api.get<{
      message: string;
      data: ITeamSeasonCategory[];
    }>(`player-memberships/team-season/${teamSeasonId}/categories`);

    return {
      error: false,
      data: response.data,
      message: response.message,
    };
  });
};
