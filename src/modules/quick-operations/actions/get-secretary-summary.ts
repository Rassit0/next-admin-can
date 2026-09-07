"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { ISecretarySummaryResponse } from "../interfaces/secretary-summary.interface";

export const getSecretarySummary = async (
  personId: string,
  signal?: AbortSignal,
): Promise<ServiceResponse<ISecretarySummaryResponse>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<ISecretarySummaryResponse>(
      `persons/${personId}/secretary-summary`,
      {
        next: {
          tags: [`person-${personId}-summary`, `charges`],
          revalidate: 60, // Revalidate every minute or when invalidated manually
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
        signal,
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Resumen obtenido exitosamente",
    };
  });
};
