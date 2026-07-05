"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";

interface Props {
  id: number;
}

export const deleteDiscipline = async ({
  id,
}: Props): Promise<ServiceResponse<IDiscipline>> => {
  try {
    const res = await api.delete<{ message: string; data: IDiscipline }>(
      `disciplines/${id}`,
    );

    updateTag("disciplines");
    return {
      error: false,
      data: res.data,
      message: res.message || "Disciplina eliminada exitosamente",
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
