import { z } from "zod";

export const scheduleFormSchema = z.object({
  locationId: z.string().uuid("Seleccione una ubicación válida").nullable().optional(),
  title: z.string().optional(),
  
  // Fecha desde la cual empieza a aplicar (por defecto puede ser el inicio de la temporada)
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  
  // Hora de inicio del entrenamiento (ej. "15:00")
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  
  // Duración
  durationMin: z.coerce.number().min(1, "La duración debe ser mayor a 0").default(90),
  
  // Días de recurrencia en formato RRULE (MO, TU, WE, TH, FR, SA, SU)
  days: z.array(z.string()).min(1, "Seleccione al menos un día de la semana"),
  
  // Hasta cuándo se repite
  untilDate: z.string().min(1, "La fecha límite es requerida"),
  
  timezone: z.string().optional().default("America/La_Paz"),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
