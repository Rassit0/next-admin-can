import { IMemberTeamSeasonAssignment } from "@/modules/membresias/types";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type PaymentMethod = "credit-card" | "debit-card" | "bank-transfer" | "cash";

export interface IPaymentRecord {
  id: string;
  assignmentId: string;
  assignment?: IMemberTeamSeasonAssignment;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  failureReason?: string;
  processedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentRecordResponse {
  data: IPaymentRecord[];
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

export interface IPaymentInput {
  assignmentId: string;
  amount: number;
  method: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  notes?: string;
}

export interface IPaymentResponse {
  id: string;
  assignmentId: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  message: string;
  timestamp: Date;
}

export interface IPaymentMetrics {
  totalProcessed: number;
  totalPending: number;
  totalFailed: number;
  successRate: number;
  totalRevenue: number;
  averageTransactionSize: number;
}
