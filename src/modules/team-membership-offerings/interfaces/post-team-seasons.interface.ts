import { StatusTeamSeason } from "./team-seasons.interface";

export interface PostOfferingInterface {
  teamId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  maxMembers: number;
  minMembers: number;
  minYear: number;
  maxYear: number;
  recurringFee: string; // precio de la mensualidad
  registrationFee: string; // Precio de la matricula
  fullPaymentDiscountPercent: string; // Porcentaje de descuento por pago completo
  lateFeeEnabled: boolean; // Habilitar recargo por mora
  lateFeePerDay: string; // Recargo por dia de mora
  graceDays: number; // Dias de gracia
  suspensionAfterMonthsDue: number; // Cantidad de meses para la suspension del miembro
  status: StatusTeamSeason; // Estado de la oferta
}
