// utils/handleServerAction.ts
"use server";
import { ApiError } from "@/utils/api/errors/ApiError";
import { ServiceResponse } from "@/types/api";
import { logoutAction } from "@/modules/auth/actions/logout";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function handleServerAction<T>(
  fn: () => Promise<ServiceResponse<T>>,
  callbackUrl?: string,
  skip401Redirect: boolean = false,
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

      if (error.statusCode === 401 && !skip401Redirect) {
        // Obtenemos la URL actual automáticamente desde los headers
        const headersList = await headers();
        const referer = headersList.get("referer");

        // Next.js envía este header exclusivamente cuando se ejecuta un Server Action
        const isServerAction = headersList.has("next-action") || headersList.has("next-router-state-tree");
        
        const finalRedirectTo = callbackUrl || referer || undefined;

        if (isServerAction) {
          // Si estamos en un Server Action (ej. click en botón), SÍ podemos modificar cookies
          await logoutAction(finalRedirectTo);
        } else {
          // Si estamos en un Server Component (ej. cargando la página), NO podemos modificar cookies
          redirect(`/login?expired=true&redirectTo=${encodeURIComponent(finalRedirectTo || "/")}`);
        }
      }

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
      message: "Ocurrió un error inesperado. Por favor, intenta más tarde.",
      statusCode: 500,
    };
  }
}
