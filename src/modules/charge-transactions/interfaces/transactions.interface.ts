export interface ITransaction {
  id: string;
  paymentId?: string;
  payerPersonId: string;
  receiptSeries: string;
  receiptNumber: number;
  amount: number;
  transactionDate: Date | string;
  description: string;
  type: "INCOME" | "EXPENSE";
  paymentMethod: "CASH" | "TRANSFER" | "QR";
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "FAILED" | "VOIDED";
  reference?: string;
  notes?: string;
  reversesId?: string | null;
  balanceBefore?: number | null;
  balanceAfter?: number | null;
  financialAccountName?: string | null;
  receiptUrls?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  thirdParty?: {
    id: string;
    name: string;
    documentNumber: string | null;
  } | null;
  payerPerson?: {
    id: string;
    name: string;
    lastName: string | null;
    documentNumber: string | null;
  } | null;

  // Frontend grouping fields
  _isGrouped?: boolean;
  _groupedDetails?: {
    method: string;
    account: string;
    amount: number;
  }[];
}

export interface ITransactionsResponse {
  data: ITransaction[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  message: string;
}
