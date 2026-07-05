"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  ITeamsByClubOptionsResponse,
  TeamOptionsGender,
} from "@/modules/players-passes";

export const getTeamsByClubOptions = async (
  clubId: string,
  gender: TeamOptionsGender,
): Promise<ServiceResponse<ITeamsByClubOptionsResponse>> => {
  const query = new URLSearchParams();
  query.append("gender", gender);
  return handleServerAction(async () => {
    const res = await api.get<ITeamsByClubOptionsResponse>(
      `player-passes/teams/options/${clubId}?${query.toString()}`,
      {
        next: {
          tags: ["teams"],
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Opciones de equipos obtenidas exitosamente",
    };
  });
};
