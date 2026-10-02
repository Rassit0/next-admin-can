"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITransaction } from "../interfaces/transactions.interface";
import { auth } from "@/auth";
import { invalidatePaymentCaches } from "./invalidate-payment-caches";

export interface AddTransactionData {
  payerPersonId?: string | null;
  payerCompanyId?: string | null;
  amount: number;
  transactionDate: string;
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
    const sanitizedData: any = { ...data };
    if (!sanitizedData.payerPersonId) delete sanitizedData.payerPersonId;
    if (!sanitizedData.reference) delete sanitizedData.reference;
    if (!sanitizedData.notes) delete sanitizedData.notes;
    if (!sanitizedData.chargeId) delete sanitizedData.chargeId;

    let response;
    try {
      response = await api.post<{
        message: string;
        data: { transaction: ITransaction; paymentData: any };
      }>(`transactions`, sanitizedData);
    } catch (error: any) {
      if (
        error?.errors?.code === "CYCLE_ENROLLMENT_EXPIRED_CLEANED" ||
        error?.message?.includes("expirado y fue liberada")
      ) {
        // Forzar actualización de cache si se hizo cleanup en el backend
        await invalidatePaymentCaches(sanitizedData.payerPersonId, sanitizedData.chargeId);
      }
      throw error;
    }

    await invalidatePaymentCaches(sanitizedData.payerPersonId, sanitizedData.chargeId);
    return {
      error: false,
      data: response.data,
      message: response.message || "Transacción registrada exitosamente",
    };
  });
};
