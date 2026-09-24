"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const deleteNews = async (
  id: string,
  slug: string,
): Promise<ServiceResponse<void>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    await api.delete(`news/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-news");
    updateTag(`public-news-detail-${slug}`);
    updateTag("admin-news");

    return {
      error: false,
      data: undefined,
      message: "Noticia eliminada exitosamente",
    };
  });
};
