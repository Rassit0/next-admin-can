"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonsOptionsResponse } from "@/modules/team-seasons";
import { auth } from "@/auth";

export const getSeasonsByDisciplineOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<ISeasonsOptionsResponse>> => {
  const session = await auth();
  console.log("session desde getTeams:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<ISeasonsOptionsResponse>(
      `team-seasons/seasons-by-discipline/options/${disciplineId}`,
      {
        next: {
          tags: ["seasons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res,
        data: res.data.map((season) => ({
          ...season,
          startDate: new Date(season.startDate),
          endDate: new Date(season.endDate),
        })),
      },
      message: res.message || "Temporadas obtenidas exitosamente",
    };
  });
};
