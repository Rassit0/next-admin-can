import { PaginatedResponse } from "@/types/api";
import { ITransaction } from "./transactions.interface";

export interface IChargePayment {
  id: string;
  chargeId: string;
  receiptSeries: string;
  receiptNumber: number;
  amount: number;
  status: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
  transactions: ITransaction[];
}

export interface IChargePaymentsResponse {
  data: IChargePayment[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  message?: string;
}
