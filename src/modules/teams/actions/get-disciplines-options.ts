import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IDisciplineOptions,
  IDisciplineOptionsResponse,
} from "../interfaces/options.team.interface";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<IDisciplineOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<IDisciplineOptionsResponse>(
      `teams/disciplines/options`,
      {
        next: {
          tags: ["disciplines"],
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
