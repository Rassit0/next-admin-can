"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISessionBookingResponse } from "@/modules/attendance/types";

export const getSessionBookings = async (
  sessionId: string,
): Promise<ServiceResponse<ISessionBookingResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    params.set("sessionId", sessionId);
    params.set("per_page", "1000"); // Fetch all bookings for the session

    const res = await api.get<ISessionBookingResponse & { message?: string }>(
      `session-bookings?${params.toString()}`,
    );

    return {
      error: false,
      data: res,
      message: res.message || "Asistencias obtenidas exitosamente",
    };
  });
};
