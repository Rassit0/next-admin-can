"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamSeason } from "@/modules/team-seasons";

export const deleteTeamSeason = async (
  id: string,
): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada eliminada exitosamente",
    };
  });
};
