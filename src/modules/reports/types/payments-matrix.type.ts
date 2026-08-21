export interface PaymentMatrixPeriod {
  key: string;
  label: string;
  startDate: string;
  endDate: string;
}

export interface PaymentMatrixPaymentDetail {
  amount: number;
  date: string;
}

export interface PaymentMatrixPeriodData {
  totalPaid: number;
  payments: PaymentMatrixPaymentDetail[];
}

export interface PaymentMatrixStudent {
  id: string;
  name: string;
  paymentsByPeriod: Record<string, PaymentMatrixPeriodData>;
}

export interface PaymentMatrixGroup {
  id: string;
  name: string;
  type: 'COURSE_SEASON_SHIFT' | 'TEAM_SEASON';
  category?: string;
  teacher?: string;
}

export interface PaymentsMatrixResponse {
  group: PaymentMatrixGroup;
  periods: PaymentMatrixPeriod[];
  students: PaymentMatrixStudent[];
}
