"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { IActivity } from "../interfaces/activity.interface";

interface Props {
  id: number;
}

export const deleteActivity = async ({
  id,
}: Props): Promise<ServiceResponse<IActivity>> => {
  try {
    const res = await api.delete<{ message: string; data: IActivity }>(
      `activities/${id}`,
    );

    updateTag("activities");
    return {
      error: false,
      data: res.data,
      message: res.message || "Actividad eliminada exitosamente",
    };
  } catch (error: any) {
    // 1. Manejo de Errores Controlados (API)
    if (error instanceof ApiError) {
      console.warn(`[ApiError ${error.statusCode}]: ${error.message}`);

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
