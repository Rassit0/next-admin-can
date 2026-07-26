import { redirect } from "next/navigation";
import { ServiceResponse } from "@/types/api";
import { logoutAction } from "@/modules/auth/actions/logout";

/**
 * Función centralizada para resolver múltiples ServiceResponses en una página (Server Component).
 * Automáticamente extrae la data, o maneja los errores redirigiendo a /api/logout si es 401,
 * o lanzando un error (para que lo capture el error.tsx de Next.js).
 */
export async function resolvePageData<T extends any[]>(promises: {
  [K in keyof T]: Promise<ServiceResponse<T[K]>>;
}): Promise<{ [K in keyof T]: ServiceResponse<T[K]> & { data: T[K] } }> {
  const results = await Promise.all(promises);

  for (const res of results) {
    if (res?.error) {
      if (res.statusCode === 401) {
        // En los Server Components NO se pueden modificar las cookies (Next.js arroja error).
        // Por lo tanto, no podemos llamar a logoutAction() ni a signOut() aquí.
        // Simplemente redirigimos al login. El usuario tendrá que volver a iniciar sesión,
        // lo cual sobreescribirá su cookie actual.
        redirect("/login?expired=true");
      }
      // Lanzar el error hará que Next.js renderice el archivo error.tsx más cercano
      throw new Error(
        res.message || "Ocurrió un error al cargar los datos de la página",
      );
    }
  }

  // Devolvemos el arreglo completo para que mantenga error, message, status y data.
  return results as unknown as { [K in keyof T]: ServiceResponse<T[K]> & { data: T[K] } };
}
