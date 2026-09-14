"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IBanner } from "@/modules/banners/interfaces/banners.interface";
import { auth } from "@/auth";

export const getBanners = async (): Promise<ServiceResponse<IBanner[]>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    const res = await api.get<IBanner[]>("banners", {
      next: {
        tags: ["admin-banners"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Banners obtenidos exitosamente",
    };
  });
};
