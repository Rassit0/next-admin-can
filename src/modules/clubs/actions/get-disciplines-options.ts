"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IDisciplineOptionsResponse } from "../interfaces/options.club.interface";
import { auth } from "@/auth";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<IDisciplineOptionsResponse>
> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<IDisciplineOptionsResponse>(
      `clubs/disciplines/options`,
      {
        next: {
          tags: ["disciplines"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
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
