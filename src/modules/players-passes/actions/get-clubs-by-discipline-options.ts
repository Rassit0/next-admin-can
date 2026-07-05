"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IClubOptionsByDisciplineResponse } from "@/modules/players-passes";

export const getClubOptionsByDisciplineOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<IClubOptionsByDisciplineResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<IClubOptionsByDisciplineResponse>(
      `player-passes/clubs/options/${disciplineId}`,
      {
        next: {
          tags: ["clubs"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Opciones de clubes obtenidas exitosamente",
    };
  });
};
