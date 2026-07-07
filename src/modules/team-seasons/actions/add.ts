"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPostTeamSeason, ITeamSeason } from "@/modules/team-seasons";
import { handleServerAction } from "@/utils";

export const addTeamSeason = async (
  data: IPostTeamSeason,
): Promise<ServiceResponse<ITeamSeason>> => {

  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ITeamSeason }>(
      `team-seasons`,
      data,
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada asignada exitosamente",
    };
  });
};
