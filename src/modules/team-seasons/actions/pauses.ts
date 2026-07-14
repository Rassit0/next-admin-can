"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { api } from "@/utils/api";

interface CreateTeamSeasonPauseDto {
  teamSeasonId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ITeamSeasonPause {
  id: string;
  teamSeasonId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
}

export const createTeamSeasonPause = async (
  data: CreateTeamSeasonPauseDto,
): Promise<ServiceResponse<ITeamSeasonPause>> => {
  return handleServerAction(async () => {
    const { teamSeasonId, ...payload } = data;
    const res = await api.post<{ message: string; data: ITeamSeasonPause }>(
      `team-seasons/${teamSeasonId}/pauses`,
      payload,
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Pausa de temporada registrada exitosamente",
    };
  });
};
