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
  status: "PENDING" | "PAID" | "FAILED" | "VOIDED";
  reference?: string;
  notes?: string;
  financialAccountName?: string | null;
  receiptUrls?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
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
