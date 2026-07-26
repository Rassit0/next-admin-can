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
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: ITransaction;
    }>(`transactions`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("transactions");
    updateTag("charges"); // Update charges to reflect the new paid status
    return {
      error: false,
      data: response.data,
      message: response.message || "Transacción registrada exitosamente",
    };
  });
};
