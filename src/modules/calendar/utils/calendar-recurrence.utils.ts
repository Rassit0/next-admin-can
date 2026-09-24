export const buildCalendarRecurrenceRule = (
  days: string[],
  untilDate: string,
): string => {
  if (!days || days.length === 0 || !untilDate) return "";

  // untilDate viene como YYYY-MM-DD. Le ponemos 23:59:59Z para cubrir todo el di­a UTC.
  const untilDateObj = new Date(`${untilDate}T23:59:59Z`);
  const untilStr =
    untilDateObj.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const byDay = days.join(","); // ej: "MO,WE"
  return `FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${untilStr}`;
};
