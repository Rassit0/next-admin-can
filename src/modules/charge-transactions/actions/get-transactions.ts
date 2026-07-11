import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  ITransaction,
  ITransactionsResponse,
} from "../interfaces/transactions.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  chargeId?: string;
  payerPersonId?: string;
}

const parseTransaction = (transaction: ITransaction): ITransaction => ({
  ...transaction,
  transactionDate: transaction.transactionDate
    ? new Date(transaction.transactionDate)
    : new Date(),
  createdAt: transaction.createdAt
    ? new Date(transaction.createdAt)
    : new Date(),
  updatedAt: transaction.updatedAt
    ? new Date(transaction.updatedAt)
    : new Date(),
});

export const getTransactions = async ({
  search,
  per_page = "10",
  page = "1",
  chargeId,
  payerPersonId,
}: SearchParams): Promise<ServiceResponse<ITransactionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (chargeId) params.set("chargeId", chargeId);
    if (payerPersonId) params.set("payerPersonId", payerPersonId);

    const res = await api.get<ITransactionsResponse>(
      `transactions?${params.toString()}`,
      {
        next: {
          tags: ["transactions"],
          revalidate: 3600,
        },
      },
    );

    const data = (res.data ?? []).map(parseTransaction);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Transacciones obtenidas exitosamente",
    };
  });
};
