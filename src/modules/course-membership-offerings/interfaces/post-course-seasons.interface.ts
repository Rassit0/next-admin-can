import { StatusCourseSeason } from "./course-seasons.interface";

export interface PostOfferingInterface {
  courseId: string;
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
  status: StatusCourseSeason; // Estado de la oferta
}
