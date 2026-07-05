import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export const getSeasonsOptions = async (): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(`team-seasons/seasons/options`, {
      next: {
        tags: ["seasons"],
        revalidate: 60 * 60 * 24 * 7, //1 semana
      },
    });

    return {
      error: false,
      data: {
        ...res,
      },
      message: res.message || "Temporadas obtenidas exitosamente",
    };
  });
};
