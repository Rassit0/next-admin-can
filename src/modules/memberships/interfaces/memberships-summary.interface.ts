export interface MembershipsSummaryResponse {
  counters: {
    active: number;
    suspended: number;
    total: number;
    studentsActive: number;
    playersActive: number;
  };
  financialSummary: {
    totalPendingDebt: number;
    collectedThisMonth: number;
  };
  revenueSummary: {
    name: string;
    ingresos: number;
    deuda: number;
  }[];
  membershipGrowth: {
    newThisMonth: number;
    growthPercentage: number;
  };
  membershipDistribution: {
    byStatus: {
      name: string;
      value: number;
    }[];
  };
  upcomingRenewals: {
    id: string;
    type: string;
    name: string;
    program: string;
    endedAt: string;
  }[];
  upcomingCharges: {
    id: string;
    amount: number;
    dueDate: string;
    personName: string;
    type: string;
  }[];
  recentPayments: {
    id: string;
    amount: number;
    date: string;
    payerName: string;
    method: string;
  }[];
  topDebtors: {
    id: string;
    debt: number;
    dueDate: string;
    personName: string;
    type: string;
    phone: string;
  }[];
  alerts: {
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'info' | 'error' | 'success';
  }[];
}
