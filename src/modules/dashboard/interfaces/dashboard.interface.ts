export interface IDashboardPeriod {
  from: string;
  to: string;
  label: string;
}

export interface IDashboardAccountBalance {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  percentage: number;
}

export interface IDashboardLiquidity {
  total: number;
  currency: string;
  activeAccountsCount: number;
  accounts: IDashboardAccountBalance[];
}

export interface IDashboardFinancialFlowPoint {
  date: string;
  income: number;
  expense: number;
  netMargin: number;
}

export interface IDashboardFinancialFlow {
  totalIncome: number;
  totalExpense: number;
  netResult: number;
  series: IDashboardFinancialFlowPoint[];
}

export interface IDashboardReceivablesSummary {
  totalPending: number;
  overdueAmount: number;
  currentAmount: number;
  overduePercentage: number;
  pendingChargesCount: number;
  overdueChargesCount: number;
}

export interface IDashboardCommunitySummary {
  uniqueActivePeople: number;
  totalActiveMemberships: number;
  activeStudents: number;
  activePlayers: number;
  dualAthletesCount: number;
}

export interface IDashboardShiftOccupancyItem {
  courseSeasonId: string;
  courseSeasonShiftId: string;
  courseName: string;
  shiftName: string;
  disciplineName?: string;
  occupied: number;
  capacity: number;
  available: number;
  rate: number;
}

export interface IDashboardCoursesOccupancy {
  totalCapacity: number;
  totalOccupied: number;
  globalRate: number;
  topOccupiedShifts: IDashboardShiftOccupancyItem[];
}

export interface IDashboardAlertItem {
  id: string;
  type: "FULL_SHIFT" | "OVERDUE_RECEIVABLES" | "EXPIRING_CYCLE";
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  description: string;
  count?: number;
  actionLabel?: string;
  actionUrl?: string;
}

export interface IDashboardSummary {
  period: IDashboardPeriod;
  liquidity?: IDashboardLiquidity;
  financialFlow?: IDashboardFinancialFlow;
  receivables?: IDashboardReceivablesSummary;
  community?: IDashboardCommunitySummary;
  coursesOccupancy?: IDashboardCoursesOccupancy;
  alerts?: IDashboardAlertItem[];
}

export interface IDashboardSummaryParams {
  from?: string;
  to?: string;
}

export type DashboardActivityActionType =
  | "PAYMENT"
  | "INTERNAL_TRANSFER"
  | "ENROLLMENT"
  | "MEMBERSHIP_STATUS"
  | "SHIFT_OCCUPANCY"
  | "SYSTEM";

export interface IDashboardActivityUser {
  id: string;
  displayName: string;
}

export interface IDashboardActivityContext {
  title: string;
  description?: string;
  amount?: number;
  currency?: string;
  identifier?: string;
}

export interface IDashboardActivityItem {
  id: string;
  actionType: DashboardActivityActionType;
  rawAction: string;
  entityName: string;
  entityId?: string;
  createdAt: string;
  user: IDashboardActivityUser | null;
  context: IDashboardActivityContext;
}

export interface IDashboardActivityResponse {
  items: IDashboardActivityItem[];
  total: number;
}

export interface IDashboardActivityParams {
  limit?: number;
}

export interface IDashboardMatchItem {
  id: string;
  homeTeam: {
    id?: string;
    name: string;
    imageUrl?: string | null;
  };
  awayTeam: {
    id?: string;
    name: string;
    imageUrl?: string | null;
  };
  homeScore?: number | null;
  awayScore?: number | null;
  result?: string;
  competitionName?: string | null;
  event: {
    startDate: string;
    endDate?: string | null;
    location?: {
      id?: string;
      name?: string;
      address?: string | null;
    } | null;
  };
}
