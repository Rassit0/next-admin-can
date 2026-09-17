"use server";
import { ServiceResponse } from "@/types/api";
import { api } from "@/utils/api";
import { IHomeDiscipline } from "@/modules/cms/home-disciplines";

export const getPublicHomeDisciplines = async (): Promise<ServiceResponse<IHomeDiscipline[]>> => {
  try {
    const response = await api.get<IHomeDiscipline[]>(
      `public/home-disciplines`,
      {
        next: { tags: ["public-home-disciplines"], revalidate: 3600 },
      }
    );

    return {
      error: false,
      data: response,
      message: "Bloques obtenidos exitosamente",
    };
  } catch (error: any) {
    return {
      error: true,
      message: error?.message || "Ocurrió un error al obtener los bloques",
      statusCode: error?.statusCode || 500,
    };
  }
};
