"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { INewsCategory, UpdateNewsCategoryInterface } from "../interfaces/news-categories.interface";
import { auth } from "@/auth";
import { updateTag } from "next/cache";

export const editNewsCategory = async (id: string, data: UpdateNewsCategoryInterface): Promise<ServiceResponse<INewsCategory>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado" } as any;

  return handleServerAction(async () => {
    const res = await api.patch<INewsCategory>(`news-categories/${id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("admin-news-categories");
    updateTag("admin-news");
    updateTag("public-news");

    // Invalidate specific news details
    const slugsRes = await api.get<string[]>(`news-categories/${id}/news-slugs`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    if (Array.isArray(slugsRes)) {
      slugsRes.forEach((slug) => {
        updateTag(`public-news-detail-${slug}`);
      });
    }

    return {
      error: false,
      data: res,
      message: "Categoría actualizada exitosamente",
    };
  });
};
