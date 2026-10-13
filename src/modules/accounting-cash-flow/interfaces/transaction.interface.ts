import { PaginatedResponse } from "@/types/api";

export interface ITransaction {
  id: string;
  kind: 'TRANSACTION' | 'PAYMENT' | 'INTERNAL_TRANSFER';
  transactionDate: Date | string;
  createdAt: Date | string;
  receiptSeries: string | null;
  receiptNumber: number | null;
  concept: string;
  amount: number;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  
  accountId?: string | null;
  accountName?: string | null;
  paymentMethod?: string | null;
  reference?: string | null;

  sourceAccountId?: string | null;
  sourceAccountName?: string | null;
  destAccountId?: string | null;
  destAccountName?: string | null;

  balanceBefore?: number | null;
  balanceAfter?: number | null;
  sourceBalanceBefore?: number | null;
  sourceBalanceAfter?: number | null;
  destBalanceBefore?: number | null;
  destBalanceAfter?: number | null;

  groupedDetails?: {
    method: string;
    account: string;
    accountId?: string;
    amount: number;
    balanceBefore: number | null;
    balanceAfter: number | null;
  }[];

  payerName?: string | null;
  beneficiaryName?: string | null;
  status?: string;
  
  // Retro-compatibility fields for the generic table renderer (if any)
  category?: string | null;
  origin?: string;
  reversesId?: string | null;
}

export type ITransactionsResponse = PaginatedResponse<ITransaction>;
