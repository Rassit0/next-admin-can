import { EventInput } from "@fullcalendar/core";
import { ICalendarEventResponse } from "../interfaces/calendar.interface";

export const mapBackendToCalendarEvent = (event: ICalendarEventResponse): EventInput => {
  return {
    id: event.id,
    title: event.title || event.type,
    start: event.startDate,
    end: event.endDate,
    backgroundColor: event.status === "CANCELLED" ? "#cbd5e1" : (event.color || "#3788d8"),
    borderColor: event.status === "CANCELLED" ? "#94a3b8" : undefined,
    textColor: event.status === "CANCELLED" ? "#475569" : "#ffffff",
    extendedProps: {
      type: event.type,
      location: event.location,
      metadata: event.metadata,
      series: event.series,
      status: event.status,
    }
  };
};
