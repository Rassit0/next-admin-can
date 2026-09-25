"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { INews } from "@/modules/cms/news";
import { handleServerAction } from "@/utils";

export const addNews = async (
  data: FormData,
): Promise<ServiceResponse<INews>> => {
  return handleServerAction(async () => {
    const response = await api.post<INews>("news", data);

    updateTag("public-news");
    updateTag("admin-news");

    return {
      error: false,
      data: response,
      message: "Noticia agregada exitosamente",
    };
  });
};
