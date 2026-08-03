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
    totalAccountReceivables: number;
    totalMembershipReceivables: number;
    totalPayables: number;
    receivablesTrend: number;
    payablesTrend: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    totalInCash: number;
    totalInBanks: number;
    netPosition: number;
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
}
