export interface IDashboardAlert {
  context: string;
  count: number;
  label: string;
  href: string;
  severity: "default" | "accent" | "success" | "warning" | "danger";
  type: string;
  icon?: string;
}

export interface IAccountingDashboardSummary {
  kpis: {
    treasury: {
      availableBalance: number;
    };
    financial: {
      totalReceivables: number;
      totalPayables: number;
      netPosition: number;
      receivablesTrend: number;
      payablesTrend: number;
    };
    monthlyIncome: number;
    monthlyExpenses: number;
  };
  alerts: IDashboardAlert[];
  cashFlow: {
    name: string;
    ingresos: number;
    egresos: number;
  }[];
  expensesByCategory: {
    name: string;
    value: number;
  }[];
  accounts: {
    id: string;
    name: string;
    type: string;
    currency: string;
    isActive: boolean;
    balance: number;
  }[];
}
