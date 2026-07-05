import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { IPerson, IPersonsResponse } from "@/modules/persons";

interface SearchParams {
  id: number;
}

export const findPersonById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IPerson>> => {
  try {
    const res = await api.get<{ data: IPerson; message: string }>(
      `persons/${id}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["persons"],
          revalidate: 3600,
        },
      },
    );

    const person = {
      ...res.data,
      birthDate: res.data.birthDate ? new Date(res.data.birthDate) : null,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };
    return {
      error: false,
      data: person,
      message: "Miembro obtenido exitosamente",
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
