import { PaginatedResponse } from "@/types/api";

export interface ITransaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  concept: string;
  category: string | null;
  origin: string;
  paymentMethod: "CASH" | "TRANSFER" | "QR";
  transactionDate: Date | string;
  status: string;
  receiptSeries: string;
  receiptNumber: number;
  reference: string | null;
  financialAccountName: string | null;
  thirdParty: {
    id: string;
    name: string;
    documentNumber: string | null;
  } | null;
  payerPerson: {
    id: string;
    name: string;
    lastName: string | null;
    documentNumber: string | null;
  } | null;
  createdAt: Date | string;
}

export type ITransactionsResponse = PaginatedResponse<ITransaction>;
