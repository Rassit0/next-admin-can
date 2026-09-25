export interface IPreviewChargesResponse {
  message: string;
  data: Data;
}

export interface Data {
  charges: Charge[];
  breakdown: Breakdown;
}

export interface Breakdown {
  totalBaseAmount: number;
  totalDiscount: number;
  totalLateFee?: number;
  totalNetAmount: number;
  currency: string;
}

export interface Charge {
  type: string;
  description: string;
  amount: number;
  baseAmount: number;
  adjustmentAmount: number;
  discountPercent: number;
  dueDate: Date;
  billingYear: number;
  billingMonth: number;
  parentChargeType?: string;
}
