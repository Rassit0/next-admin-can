"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { INewsCategory } from "../interfaces/news-categories.interface";
import { auth } from "@/auth";

export const getNewsCategories = async (): Promise<
  ServiceResponse<INewsCategory[]>
> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesón ha expirado. Por favor, inicie sesón nuevamente.",
    } as any;

  return handleServerAction(async () => {
    const res = await api.get<INewsCategory[]>("news-categories", {
      next: {
        tags: ["admin-news-categories"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Categorías obtenidas exitosamente",
    };
  });
};
