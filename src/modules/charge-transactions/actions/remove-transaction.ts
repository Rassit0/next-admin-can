"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITransaction } from "../interfaces/transactions.interface";
import { auth } from "@/auth";

export const removeTransaction = async (
  id: string,
): Promise<ServiceResponse<ITransaction>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: ITransaction;
    }>(`transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("transactions");
    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Transacción anulada exitosamente",
    };
  });
};
