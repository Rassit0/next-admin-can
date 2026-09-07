"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const getPersonTransactions = async (
  personId: string,
  page: number = 1,
  limit: number = 10,
  signal?: AbortSignal,
): Promise<ServiceResponse<any>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<any>(
      `transactions`,
      {
        params: {
          payerPersonId: personId,
          page: page.toString(),
          per_page: limit.toString(),
          sortField: "transactionDate",
          orderBy: "desc",
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
      message: "Historial obtenido exitosamente",
    };
  });
};
