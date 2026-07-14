import { StatusTeamSeason, Gender, SeasonBillingType, BillingFrequency } from "./team-season.interface";

export interface IPostTeamSeason {
  description: string | null;
  maxMembers: number;
  minMembers: number;
  minBirthYear?: number | null;
  maxBirthYear?: number | null;
  teamId: string;
  categoryId: string;
  seasonId: string;
  gender: Gender;
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
}
