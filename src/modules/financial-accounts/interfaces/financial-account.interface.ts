export type FinancialAccountType = 'CASH' | 'BANK' | 'DIGITAL_WALLET';

export interface FinancialAccount {
  id: string;
  name: string;
  description?: string;
  type: FinancialAccountType;
  currency: string;
  initialBalance?: number; // Maintained for backward compatibility or opening balance reference
  cachedBalance: number;
  isDefault: boolean;
  accountNumber?: string;
  lastReconciledAt?: string;
  isActive: boolean;
  allowedPaymentMethods: string[];
  createdAt: string;
  updatedAt: string;
}
