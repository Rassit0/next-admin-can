"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IHomeDiscipline } from "@/modules/cms/home-disciplines/interfaces/home-discipline.interface";
import { auth } from "@/auth";

export const getHomeDisciplines = async (): Promise<
  ServiceResponse<IHomeDiscipline[]>
> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const res = await api.get<IHomeDiscipline[]>("home-disciplines", {
      next: {
        tags: ["admin-home-disciplines"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Bloques obtenidos exitosamente",
    };
  });
};
