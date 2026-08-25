import { StatusTeamSeason, Gender, SeasonBillingType, BillingFrequency } from "./team-season.interface";

export interface IPostTeamSeason {
  description: string | null;
  teamId: string;
  seasonId: string;
  billingConfig: {
    billingDay: number; // Dia de facturacion
    registrationFee?: string | null; // Precio de la matricula
    recurringFee?: string | null; // precio de la mensualidad
    seasonFee?: string | null; // Tarifa completa de temporada
    billingType: SeasonBillingType; // Tipo de facturación
    billingFrequency: BillingFrequency; // Frecuencia de facturación
    prorateFirstRecurringFee: boolean;
    prorateLastRecurringFee: boolean;
    prorateRegistrationFee: boolean;
    prorateSeasonFee: boolean;
    debtToleranceMonths: number; // Cantidad de meses para la suspension del miembro
    lateFeeEnabled: boolean; // Habilitar recargo por mora
    lateFeePerDay: string; // Recargo por dia de mora
    graceDays: number; // Dias de gracia
  };
  status: StatusTeamSeason; // Estado de la oferta
  isRegistrationOpen?: boolean;
}

export interface IPostTeamSeasonCategory {
  categoryId: string;
  gender: "MALE" | "FEMALE" | "MIXED";
  minBirthYear?: number | null;
  maxBirthYear?: number | null;
  minMembers: number;
  maxMembers: number;
  validateAge?: boolean;
}

export interface IUpdateTeamSeasonCategory extends Partial<IPostTeamSeasonCategory> {
  isActive?: boolean;
}
