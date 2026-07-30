"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITransaction, ITransactionsResponse } from "../interfaces/transaction.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  type?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  origin?: string;
  categoryId?: string;
  createdById?: string;
  sortField?: string;
  orderBy?: string;
}

const parseTransaction = (transaction: ITransaction): ITransaction => ({
  ...transaction,
  transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate) : new Date(),
  createdAt: transaction.createdAt ? new Date(transaction.createdAt) : new Date(),
});

export const getTransactions = async ({
  search,
  per_page = "10",
  page = "1",
  type,
  paymentMethod,
  startDate,
  endDate,
  origin,
  categoryId,
  createdById,
  sortField,
  orderBy,
}: SearchParams): Promise<ServiceResponse<ITransactionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (type) params.set("type", type);
    if (paymentMethod) params.set("paymentMethod", paymentMethod);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (origin) params.set("origin", origin);
    if (categoryId) params.set("categoryId", categoryId);
    if (createdById) params.set("createdById", createdById);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

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
      data: { ...res, data } as ITransactionsResponse,
      message: res.message || "Transacciones obtenidas exitosamente",
    };
  });
};
