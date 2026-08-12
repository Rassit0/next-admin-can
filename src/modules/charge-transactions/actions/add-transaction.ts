"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITransaction } from "../interfaces/transactions.interface";
import { auth } from "@/auth";

export interface AddTransactionData {
  payerPersonId: string;
  amount: number;
  transactionDate: Date | string;
  description: string;
  type: "INCOME" | "EXPENSE";
  paymentMethod: "CASH" | "TRANSFER" | "QR";
  financialAccountId: string;
  reference?: string;
  notes?: string;
  chargeId?: string;
  splitTransactions?: {
    amount: number;
    paymentMethod: "CASH" | "TRANSFER" | "QR";
    financialAccountId: string;
    reference?: string;
  }[];
}

export const addTransaction = async (
  data: AddTransactionData,
): Promise<
  ServiceResponse<{ transaction: ITransaction; paymentData: any }>
> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: { transaction: ITransaction; paymentData: any };
    }>(`transactions`, data);

    updateTag("transactions");
    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Transacción registrada exitosamente",
    };
  });
};
