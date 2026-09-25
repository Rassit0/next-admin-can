"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IHomeDiscipline } from "@/modules/cms/home-disciplines/interfaces/home-discipline.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const editHomeDiscipline = async (
  id: string,
  data: FormData,
): Promise<ServiceResponse<IHomeDiscipline>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesón ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const response = await api.patch<IHomeDiscipline>(
      `home-disciplines/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("public-home-disciplines");
    updateTag("admin-home-disciplines");

    return {
      error: false,
      data: response,
      message: "Bloque actualizado exitosamente",
    };
  });
};
