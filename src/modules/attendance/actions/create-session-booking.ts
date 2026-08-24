"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISessionBooking } from "@/modules/attendance/types";

export const createSessionBooking = async (
  sessionId: string,
  studentId: string,
): Promise<ServiceResponse<ISessionBooking>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ data: ISessionBooking; message: string }>(
      "session-bookings",
      {
        sessionId,
        studentId,
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Asistencia registrada exitosamente",
    };
  });
};
