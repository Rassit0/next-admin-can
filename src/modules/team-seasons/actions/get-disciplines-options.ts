"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<{
    data: { id: string; name: string; icon: string }[];
    message: string;
  }>
> => {
  const session = await auth();
  console.log("session desde getDisciplinesOptions:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{
      message: string;
      data: { id: string; name: string; icon: string }[];
    }>(`team-seasons/disciplines/options`, {
      next: {
        tags: ["disciplines"],
        revalidate: 60 * 60 * 24 * 7, //1 semana
      },
    });

    return {
      error: false,
      data: res,
      message: res.message || "Disciplinas obtenidas exitosamente",
    };
  });
};
