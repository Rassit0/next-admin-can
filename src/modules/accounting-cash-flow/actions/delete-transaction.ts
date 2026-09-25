"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const deleteTransaction = async (
  id: string,
): Promise<ServiceResponse<null>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string }>(`transactions/${id}`);
    updateTag("transactions");
    return {
      error: false,
      data: null,
      message: res?.message || "Transacción anulada exitosamente",
    };
  });
};
