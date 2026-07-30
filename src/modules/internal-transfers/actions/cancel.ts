"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { InternalTransfer } from "../interfaces/internal-transfer.interface";

export const cancelInternalTransfer = async (
  id: string,
): Promise<ServiceResponse<InternalTransfer>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: InternalTransfer }>(
      `internal-transfers/${id}/cancel`,
      {},
    );

    updateTag("internal-transfers");
    updateTag("financial-accounts");

    return {
      error: false,
      data: response.data,
      message: response.message || "Transferencia anulada exitosamente",
    };
  });
};
