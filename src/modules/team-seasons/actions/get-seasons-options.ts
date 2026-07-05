import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonsOptionsResponse } from "@/modules/team-seasons";

export const getSeasonsByDisciplineOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<ISeasonsOptionsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<ISeasonsOptionsResponse>(
      `team-seasons/seasons-by-discipline/options/${disciplineId}`,
      {
        next: {
          tags: ["seasons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
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
