import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPlayerPassActiveOptionsResponse } from "@/modules/players-passes";

export const getActivePassesByPlayerByDisciplineOptions = async (
  playerId: string,
  disciplineId: string,
): Promise<ServiceResponse<IPlayerPassActiveOptionsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<IPlayerPassActiveOptionsResponse>(
      `player-passes/active/options/${playerId}/${disciplineId}`,
      {
        next: {
          tags: ["player-passes"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message:
        res.message || "Opciones de pases activos obtenidos exitosamente",
    };
  });
};
