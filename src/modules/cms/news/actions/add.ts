"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { INews, PostNewsInterface } from "@/modules/cms/news";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const addNews = async (
  data: FormData,
): Promise<ServiceResponse<INews>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    const response = await api.post<INews>("news", data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-news");
    updateTag("admin-news");
    
    return {
      error: false,
      data: response,
      message: "Noticia agregada exitosamente",
    };
  });
};
