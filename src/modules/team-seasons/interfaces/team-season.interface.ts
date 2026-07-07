export interface ITeamSeasonResponse {
  data: ITeamSeason[];
  meta: Meta;
  message: string;
}

export type Gender = "MALE" | "FEMALE" | "MIXED";
export type StatusTeamSeason = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELLED";
export type SeasonBillingType = "MONTHLY_ONLY" | "SINGLE_ONLY" | "BOTH";
export type BillingFrequency = "MONTHLY" | "WEEKLY" | "BIWEEKLY" | "SINGLE";

export interface ITeamSeason {
  id: string;
  gender: Gender;
  team: Category;
  category: Category;
  season: Season;
  description: string | null;
  maxMembers: number;
  minMembers: number;
  minBirthYear?: number | null;
  maxBirthYear?: number | null;
  billingDay: number; // Día de facturación
  registrationFee?: string | null; // Tarifa de inscripción
  recurringFee?: string | null; // Tarifa mensual
  seasonFee?: string | null; // Tarifa completa de temporada
  billingType: SeasonBillingType; // Tipo de facturación
  billingFrequency: BillingFrequency; // Frecuencia de facturacion
  prorateFirstRecurringFee: boolean;
  prorateLastRecurringFee: boolean;
  prorateRegistrationFee: boolean;
  prorateSeasonFee: boolean;
  debtToleranceMonths: number; // Meses de tolerancia de deuda
  lateFeeEnabled: boolean; // Habilitar recargo por mora
  lateFeePerDay: string; // Recargo por mora por día
  graceDays: number; // Días de gracia
  status: StatusTeamSeason;
  _count: {
    playerMemberships: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface Season {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null | number;
  prevPage: null | number;
}
