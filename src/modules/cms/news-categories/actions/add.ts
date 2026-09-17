"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { INewsCategory, PostNewsCategoryInterface } from "../interfaces/news-categories.interface";
import { auth } from "@/auth";
import { updateTag } from "next/cache";

export const addNewsCategory = async (data: PostNewsCategoryInterface): Promise<ServiceResponse<INewsCategory>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado" } as any;

  return handleServerAction(async () => {
    const res = await api.post<INewsCategory>("news-categories", data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("admin-news-categories");
    updateTag("admin-news");
    updateTag("public-news");

    return {
      error: false,
      data: res,
      message: "Categoría creada exitosamente",
    };
  });
};
