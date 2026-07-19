"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICategoriesOptionsResponse } from "@/modules/course-seasons";

export const getCategoriesByDisciplineOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<ICategoriesOptionsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<ICategoriesOptionsResponse>(
      `course-seasons/categories-by-discipline/options/${disciplineId}`,
      {
        next: {
          tags: ["categories"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: {
        ...res,
      },
      message: res.message || "Categorias obtenidas exitosamente",
    };
  });
};
