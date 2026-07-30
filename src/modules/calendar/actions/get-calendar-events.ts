"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICalendarEventResponse } from "../interfaces/calendar.interface";

export const getCalendarEventsAction = async (
  startDate: string,
  endDate: string,
  eventTypes?: string[],
  locationId?: string
): Promise<ServiceResponse<ICalendarEventResponse[]>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    params.set("startDate", startDate);
    params.set("endDate", endDate);
    if (eventTypes && eventTypes.length > 0) {
      eventTypes.forEach(t => params.append("eventTypes", t));
    }
    if (locationId) params.set("locationId", locationId);

    const res = await api.get<any>(
      `calendar?${params.toString()}`,
      {
        next: {
          tags: ["calendar"],
          revalidate: 60, // Short cache for calendar
        },
      }
    );

    const eventsArray = Array.isArray(res) ? res : (res?.events || []);

    return {
      error: false,
      data: eventsArray,
      message: "Eventos obtenidos exitosamente",
    };
  });
};
