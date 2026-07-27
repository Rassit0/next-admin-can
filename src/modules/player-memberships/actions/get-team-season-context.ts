"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { TeamSeasonContext } from "@/modules/player-memberships";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamSeasonContext = async ({
  id,
}: SearchParams): Promise<ServiceResponse<TeamSeasonContext>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: TeamSeasonContext }>(
      `player-memberships/team-season/context/${id}`,
      {
        next: {
          tags: ["team-seasons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: "Contexto de la temporada del equipo obtenido exitosamente",
    };
  });
};
