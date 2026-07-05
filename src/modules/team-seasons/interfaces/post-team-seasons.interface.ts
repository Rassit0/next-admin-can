import { StatusTeamSeason, Gender } from "./team-season.interface";

export interface IPostTeamSeason {
  description: string | null;
  maxMembers: number;
  minMembers: number;
  teamId: string;
  categoryId: string;
  seasonId: string;
  gender: Gender;
  billingDay: number; // Dia de facturacion
  registrationFee: string; // Precio de la matricula
  monthlyFee: string; // precio de la mensualidad
  debtToleranceMonths: number; // Cantidad de meses para la suspension del miembro
  lateFeeEnabled: boolean; // Habilitar recargo por mora
  lateFeePerDay: string; // Recargo por dia de mora
  graceDays: number; // Dias de gracia
  status: StatusTeamSeason; // Estado de la oferta
}
