import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IDisciplineOptionsResponse } from "@/modules/categories";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<IDisciplineOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<IDisciplineOptionsResponse>(
      `clubs/disciplines/options`,
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
      message: res.message || "Disciplinas obtenidas exitosamente",
    };
  });
};
