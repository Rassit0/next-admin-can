"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IClubOptions,
  IClubOptionsResponse,
} from "../interfaces/options.team.interface";

export const getClubsOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<IClubOptionsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<IClubOptionsResponse>(
      `teams/clubs-by-discipline/options/${disciplineId}`,
      {
        next: {
          tags: ["clubs"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: {
        ...res,
      },
      message: res.message || "Clubes obtenidos exitosamente",
    };
  });
};
