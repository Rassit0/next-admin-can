"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

export const deleteNews = async (
  id: string,
  slug: string,
): Promise<ServiceResponse<void>> => {
  return handleServerAction(async () => {
    await api.delete(`news/${id}`);

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
