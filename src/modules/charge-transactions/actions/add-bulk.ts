"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface AddBulkTransactionData {
  payerPersonId?: string;
  charges: {
    chargeId: string;
    splitTransactions?: {
      amount: number;
      paymentMethod: string;
      financialAccountId: string;
      reference?: string;
    }[];
  }[];
  totalAmount?: number;
  paymentMethod?: "CASH" | "TRANSFER" | "QR";
  financialAccountId?: string;
  reference?: string;
  notes?: string;
  transactionDate?: string;
}

export interface AddBulkTransactionResponse {
  transactionsCount: number;
  totalAmount: number;
  receiptIds: string[];
  bulkReceiptId?: string;
}

export const addBulk = async (
  data: AddBulkTransactionData,
): Promise<ServiceResponse<AddBulkTransactionResponse>> => {
  return handleServerAction(async () => {
    const sanitizedData: any = { ...data };
    if (!sanitizedData.payerPersonId) delete sanitizedData.payerPersonId;
    if (!sanitizedData.reference) delete sanitizedData.reference;
    if (!sanitizedData.notes) delete sanitizedData.notes;
    if (!sanitizedData.transactionDate) delete sanitizedData.transactionDate;

    const response = await api.post<AddBulkTransactionResponse & { message?: string }>(
      `transactions/bulk`, 
      sanitizedData
    );

    updateTag("transactions");
    updateTag("charges");
    
    return {
      error: false,
      data: {
        transactionsCount: response.transactionsCount,
        totalAmount: response.totalAmount,
        receiptIds: response.receiptIds,
        bulkReceiptId: response.bulkReceiptId,
      },
      message: response.message || "Cobros masivos registrados exitosamente",
    };
  });
};
