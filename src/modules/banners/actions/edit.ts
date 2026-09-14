"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IBanner, UpdateBannerInterface } from "@/modules/banners/interfaces/banners.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const editBanner = async (
  id: string,
  data: UpdateBannerInterface,
): Promise<ServiceResponse<IBanner>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    const response = await api.patch<IBanner>(`banners/${id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-banners");
    updateTag("admin-banners");
    
    return {
      error: false,
      data: response,
      message: "Banner actualizado exitosamente",
    };
  });
};
