"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IDisciplineOptionsResponse } from "@/modules/players-passes";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<IDisciplineOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<IDisciplineOptionsResponse>(
      `player-passes/disciplines/options`,
      {
        next: {
          tags: ["disciplines"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Opciones de disciplinas obtenidas exitosamente",
    };
  });
};
