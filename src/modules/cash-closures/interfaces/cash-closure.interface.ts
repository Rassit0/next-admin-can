export interface CashClosure {
  id: string;
  financialAccountId: string;
  closedAt: string;
  expectedBalance: string | number;
  actualBalance: string | number;
  difference: string | number;
  observations?: string | null;
  createdById?: string;
  createdBy?: {
    email: string;
    person?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateCashClosureDto {
  financialAccountId: string;
  actualBalance: number;
  observations?: string;
}
