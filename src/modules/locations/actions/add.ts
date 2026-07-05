"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { ILocation } from "../interfaces/location.interface";

interface Props {
  data: {
    name: string;
    address: string;
    description?: string;
    // isActive?: boolean;
    isRentable?: boolean;
    isInternal?: boolean;
  };
}

export const addLocation = async ({
  data,
}: Props): Promise<ServiceResponse<ILocation>> => {
  try {
    console.log("data", data);

    const res = await api.post<{ message: string; data: ILocation }>(
      `locations`,
      data,
    );

    updateTag("locations");
    return {
      error: false,
      data: res.data,
      message: res.message || "Instalación agregada exitosamente",
    };
  } catch (error: any) {
    // 1. Manejo de Errores Controlados (API)
    if (error instanceof ApiError) {
      console.warn(`[ApiError ${error.statusCode}]: ${error.message}`);
      console.warn(
        `[ApiError ${error.statusCode}]: ${JSON.stringify(error.errors)}`,
      );

      // Devolvemos el error en un formato que el frontend pueda procesar fácilmente
      return {
        error: true,
        message: error.message,
        errors: error.errors, // Aquí vienen los errores de validación (ej: campos requeridos)
        statusCode: error.statusCode,
      };
    }

    // 2. Manejo de Errores Inesperados (System Error)
    console.error("[System Error]:", error); // Loguear para el backend (ej: Sentry, Winston)

    return {
      error: true,
      message: "Ocurrió un error inesperado. Por favor, intenta más tarde.",
      statusCode: 500,
    };
  }
};
