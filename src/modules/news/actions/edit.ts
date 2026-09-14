"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { INews, UpdateNewsInterface } from "@/modules/news";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const editNews = async (
  id: string,
  slug: string,
  data: UpdateNewsInterface,
): Promise<ServiceResponse<INews>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    const response = await api.patch<INews>(`news/${id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-news");
    updateTag(`public-news-detail-${slug}`);
    updateTag("admin-news");
    
    return {
      error: false,
      data: response,
      message: "Noticia actualizada exitosamente",
    };
  });
};
