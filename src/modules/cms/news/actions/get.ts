"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { INews } from "@/modules/cms/news";
import { auth } from "@/auth";

export const getNews = async (): Promise<ServiceResponse<INews[]>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente." } as any;

  return handleServerAction(async () => {
    const res = await api.get<INews[]>("news", {
      next: {
        tags: ["admin-news"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Noticias obtenidas exitosamente",
    };
  });
};
