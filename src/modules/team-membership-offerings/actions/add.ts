"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamSeason } from "../interfaces/team-seasons.interface";
import { PostOfferingInterface } from "../interfaces/post-team-seasons.interface";

export const addTeamSeason = async (
  data: PostOfferingInterface,
): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ITeamSeason }>(
      `team-seasons`,
      data,
    );

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
      message: response.message || "Temporada del equipo agregada exitosamente",
    };
  });
};
