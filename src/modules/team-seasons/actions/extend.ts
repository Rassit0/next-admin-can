"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamSeason } from "@/modules/team-seasons";

export const extendTeamSeason = async (
  id: string,
  data: {
    newEndDate: Date;
    reason: string;
  },
): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}/extend`,
      data,
    );

    console.log(response);
    updateTag("team-seasons");
    return {
      error: false,
      data: {
        ...response.data,
        startDate: new Date(response.data.season.startDate),
        endDate: new Date(response.data.season.endDate),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      },
      message:
        response.message || "Temporada del equipo extendida exitosamente",
    };
  });
};
