// utils/handleServerAction.ts
import { ApiError } from "@/modules/portal/core/api/errors/ApiError";
export interface ServiceResponse<T = any> {
  error?: boolean;
  message?: string;
  errors?: any;
  statusCode?: number;
  data?: T;
}

export async function handleServerAction<T>(
  fn: () => Promise<ServiceResponse<T>>,
): Promise<ServiceResponse<T>> {
  try {
    return await fn();
  } catch (error: any) {
    console.log("error", error);
    if (error instanceof ApiError) {
      console.warn(`[ApiError ${error.statusCode}]: ${error.message}`);
      console.warn(
        `[ApiError ${error.statusCode}]: ${JSON.stringify(error.errors)}`,
      );

      return {
        error: true,
        message: error.message,
        errors: error.errors,
        statusCode: error.statusCode,
      };
    }

    console.error("[System Error]:", error);

    return {
      error: true,
      message: "Ocurró un error inesperado. Por favor, intenta más tarde.",
      statusCode: 500,
    };
  }
}
