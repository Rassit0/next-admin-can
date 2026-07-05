export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "PROCESSING";

export type PaymentMethod = "CARD" | "TRANSFER";

export type PaymentConcept = "registration" | "monthly";

export interface IPayment {
  id: string;
  membershipId: string;
  athleteName: string;
  athleteImageUrl: string | null;
  concept: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod | null;
  reference: string | null;
  dueDate: Date;
  paidAt: Date | null;
}

export interface CardPaymentInput {
  method: "CARD";
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface TransferPaymentInput {
  method: "TRANSFER";
  bank: string;
  reference: string;
}

export type PaymentInput = CardPaymentInput | TransferPaymentInput;

export interface PaymentResult {
  success: boolean;
  reference: string;
  message: string;
}
