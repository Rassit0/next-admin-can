"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { ITeamSeason } from "@/modules/team-seasons";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamSeasonById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ITeamSeason>> => {
  const session = await auth();
  console.log("session desde getTeamSeasonById:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
      {
        next: {
          tags: ["teams"],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    const data = {
      ...res.data,
      season: {
        ...res.data.season,
        startDate: new Date(res.data.season.startDate),
        endDate: new Date(res.data.season.endDate),
      },
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };

    return {
      error: false,
      data,
      message: "Temporada de equipo obtenido exitosamente",
    };
  });
};
