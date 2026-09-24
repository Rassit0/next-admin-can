"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IHeroBanner } from "@/modules/cms/hero-banners/interfaces/hero-banner.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const editHeroBanner = async (
  id: string,
  data: FormData,
): Promise<ServiceResponse<IHeroBanner>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const response = await api.patch<IHeroBanner>(`hero-banners/${id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-hero-banners");
    updateTag("admin-hero-banners");

    return {
      error: false,
      data: response,
      message: "Hero Banner actualizado exitosamente",
    };
  });
};
