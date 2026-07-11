"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITransaction } from "../interfaces/transactions.interface";

export interface AddTransactionData {
  payerPersonId: string;
  amount: number;
  transactionDate: Date | string;
  description: string;
  type: "INCOME" | "EXPENSE";
  paymentMethod: "CASH" | "TRANSFER" | "QR";
  reference?: string;
  notes?: string;
  chargeTransactions: {
    chargeId: string;
    amountApplied: number;
  }[];
}

export const addTransaction = async (
  data: AddTransactionData,
): Promise<ServiceResponse<ITransaction>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: ITransaction;
    }>(`transactions`, data);

    updateTag("transactions");
    updateTag("charges"); // Update charges to reflect the new paid status
    return {
      error: false,
      data: response.data,
      message: response.message || "Transacción registrada exitosamente",
    };
  });
};
