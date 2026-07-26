"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { TeamSeasonContext } from "@/modules/player-memberships";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamSeasonContext = async ({
  id,
}: SearchParams): Promise<ServiceResponse<TeamSeasonContext>> => {
  const session = await auth();
  console.log("session desde getTeamSeasonContext:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: TeamSeasonContext }>(
      `player-memberships/team-season/context/${id}`,
      {
        next: {
          tags: ["team-seasons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
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
