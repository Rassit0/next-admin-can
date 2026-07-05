"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamSeason } from "../interfaces/team-seasons.interface";
import { PostOfferingInterface } from "../interfaces/post-team-seasons.interface";

export const finalizeTeamSeason = async (
  id: string,
  statusNotes: string,
): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}/finalize`,
      { statusNotes },
    );

    console.log(response);
    updateTag("team-seasons");
    return {
      error: false,
      data: {
        ...response.data,
        startDate: new Date(response.data.startDate),
        endDate: new Date(response.data.endDate),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      },
      message:
        response.message || "Temporada del equipo finalizada exitosamente",
    };
  });
};
