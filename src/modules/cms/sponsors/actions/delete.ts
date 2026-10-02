"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const deleteSponsor = async (
  id: string,
): Promise<ServiceResponse<void>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    await api.delete(`sponsors/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-sponsors");
    updateTag("admin-sponsors");

    return {
      error: false,
      data: undefined as void,
      message: "Auspiciador eliminado exitosamente",
    };
  });
};
