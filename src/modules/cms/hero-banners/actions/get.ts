"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IHeroBanner } from "@/modules/cms/hero-banners/interfaces/hero-banner.interface";
import { auth } from "@/auth";

export const getHeroBanners = async (): Promise<
  ServiceResponse<IHeroBanner[]>
> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const res = await api.get<IHeroBanner[]>("hero-banners", {
      next: {
        tags: ["admin-hero-banners"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Hero Banners obtenidos exitosamente",
    };
  });
};
