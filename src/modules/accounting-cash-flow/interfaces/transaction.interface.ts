import { PaginatedResponse } from "@/types/api";

export interface ITransaction {
  id: string;
  paymentId?: string | null;
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
  reversesId?: string | null;
  balanceBefore?: number | null;
  balanceAfter?: number | null;
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
    secondLastName?: string | null;
    documentNumber: string | null;
  } | null;
  createdAt: Date | string;

  // Frontend grouping fields
  _isGrouped?: boolean;
  _groupedDetails?: {
    method: string;
    account: string;
    amount: number;
  }[];
}

export type ITransactionsResponse = PaginatedResponse<ITransaction>;
