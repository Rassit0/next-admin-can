"use server";
import { ServiceResponse } from "@/types/api";
import { api } from "@/utils/api";
import { IHeroBanner } from "@/modules/cms/hero-banners";

export const getPublicHeroBanners = async (): Promise<ServiceResponse<IHeroBanner[]>> => {
  try {
    const response = await api.get<IHeroBanner[]>(
      `public/hero-banners`,
      {
        next: { tags: ["public-hero-banners"], revalidate: 3600 },
      }
    );

    return {
      error: false,
      data: response,
      message: "Hero Banners obtenidos exitosamente",
    };
  } catch (error: any) {
    return {
      error: true,
      message: error?.message || "Ocurrió un error al obtener los Hero Banners",
      statusCode: error?.statusCode || 500,
    };
  }
};
