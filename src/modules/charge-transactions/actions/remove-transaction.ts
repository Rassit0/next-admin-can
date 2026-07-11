"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITransaction } from "../interfaces/transactions.interface";

export const removeTransaction = async (
  id: string,
): Promise<ServiceResponse<ITransaction>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: ITransaction;
    }>(`transactions/${id}`);

    updateTag("transactions");
    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Transacción anulada exitosamente",
    };
  });
};
