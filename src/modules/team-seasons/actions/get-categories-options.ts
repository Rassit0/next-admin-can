"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICategoriesOptionsResponse } from "@/modules/team-seasons";
import { auth } from "@/auth";

export const getCategoriesByDisciplineOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<ICategoriesOptionsResponse>> => {
  const session = await auth();
  console.log("session desde getCategoriesByDisciplineOptions:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<ICategoriesOptionsResponse>(
      `team-seasons/categories-by-discipline/options/${disciplineId}`,
      {
        next: {
          tags: ["categories"],
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
      },
      message: res.message || "Categorias obtenidas exitosamente",
    };
  });
};
