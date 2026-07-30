"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { InternalTransfer } from "../interfaces/internal-transfer.interface";

export const createInternalTransfer = async (data: {
  amount: number;
  sourceAccountId: string;
  destinationAccountId: string;
  description?: string;
  reference?: string;
  date?: string;
}): Promise<ServiceResponse<InternalTransfer>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: InternalTransfer }>(
      `internal-transfers`,
      data,
    );

    updateTag("internal-transfers");
    updateTag("financial-accounts");
    
    return {
      error: false,
      data: response.data,
      message: response.message || "Transferencia registrada exitosamente",
    };
  });
};
