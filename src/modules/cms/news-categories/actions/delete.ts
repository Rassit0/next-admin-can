"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { updateTag } from "next/cache";

export const deleteNewsCategory = async (
  id: string,
): Promise<ServiceResponse<void>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesón ha expirado",
    } as any;

  return handleServerAction(async () => {
    await api.delete<void>(`news-categories/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("admin-news-categories");
    updateTag("admin-news");
    updateTag("public-news");

    return {
      error: false,
      data: undefined as any,
      message: "Categoría eliminada exitosamente",
    };
  });
};
