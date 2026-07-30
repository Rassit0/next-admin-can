import { ScheduleFormValues } from "../schemas/schedule.schema";

/**
 * Convierte los valores del formulario amigable en un payload que entiende el backend.
 */
export const buildSchedulePayload = (
  values: ScheduleFormValues,
  relations: { teamSeasonId?: string; courseSeasonId?: string }
) => {
  // 1. Construir la fecha de inicio exacta (startDate + startTime)
  // Nota: se asume que startDate y startTime vienen en formato local (ej. YYYY-MM-DD y HH:mm)
  // Lo ideal es usar la zona horaria institucional, por ahora lo armamos simple y 
  // confiamos en que el backend lo materializará en la zona enviada o en UTC
  
  const startDateTime = new Date(`${values.startDate}T${values.startTime}:00`);
  
  // 2. Calcular endDate sumando los minutos de duración a startDateTime
  const endDateTime = new Date(startDateTime.getTime() + values.durationMin * 60000);

  // 3. Generar la regla RRULE
  // Formato: FREQ=WEEKLY;BYDAY=MO,WE;UNTIL=20261231T235959Z
  
  // untilDate viene como YYYY-MM-DD. Le ponemos 23:59:59 para asegurar que cubra el último día.
  const untilDateObj = new Date(`${values.untilDate}T23:59:59Z`);
  const untilStr = untilDateObj.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  const byDay = values.days.join(","); // ej: "MO,WE"
  
  const recurrenceRule = `FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${untilStr}`;

  return {
    locationId: values.locationId,
    title: values.title,
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    durationMin: values.durationMin,
    recurrenceRule,
    timezone: values.timezone,
    teamSeasonIds: relations.teamSeasonId ? [relations.teamSeasonId] : undefined,
    courseSeasonIds: relations.courseSeasonId ? [relations.courseSeasonId] : undefined,
  };
};
