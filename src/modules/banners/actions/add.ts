"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IBanner, PostBannerInterface } from "@/modules/banners/interfaces/banners.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const addBanner = async (
  data: PostBannerInterface,
): Promise<ServiceResponse<IBanner>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    const response = await api.post<IBanner>("banners", data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-banners");
    updateTag("admin-banners");
    
    return {
      error: false,
      data: response,
      message: "Banner creado exitosamente",
    };
  });
};
