"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { INews, UpdateNewsInterface } from "@/modules/cms/news";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const editNews = async (
  id: string,
  slug: string,
  data: FormData,
): Promise<ServiceResponse<INews>> => {
  return handleServerAction(async () => {
    const response = await api.patch<INews>(`news/${id}`, data);

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
