"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { INews } from "@/modules/cms/news";

export const getNews = async (): Promise<ServiceResponse<INews[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<INews[]>("news", {
      next: {
        tags: ["admin-news"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: res,
      message: "Noticias obtenidas exitosamente",
    };
  });
};

export const getNewsById = async (id: string): Promise<ServiceResponse<INews>> => {
  return handleServerAction(async () => {
    const res = await api.get<INews>(`news/${id}`, {
      next: {
        tags: [`admin-news-detail-${id}`],
        revalidate: 0,
      },
    });

    return {
      error: false,
      data: res,
      message: "Noticia obtenida exitosamente",
    };
  });
};
