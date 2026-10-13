"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const deleteTransaction = async (
  id: string,
  kind: string = "TRANSACTION"
): Promise<ServiceResponse<null>> => {
  return handleServerAction(async () => {
    let res: { message: string };

    if (kind === "INTERNAL_TRANSFER") {
      res = await api.patch<{ message: string }>(`internal-transfers/${id}/cancel`, {});
    } else if (kind === "PAYMENT") {
      res = await api.delete<{ message: string }>(`payments/${id}`);
    } else {
      res = await api.delete<{ message: string }>(`transactions/${id}`);
    }

    updateTag("transactions");
    return {
      error: false,
      data: null,
      message: res?.message || "Operación anulada exitosamente",
    };
  });
};
