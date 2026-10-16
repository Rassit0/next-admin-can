"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchSessionAttendanceRoster } from "../api/teacher.api";
import { SessionAttendanceRoster } from "../interfaces/teacher.interface";

export const getSessionAttendance = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<ServiceResponse<SessionAttendanceRoster>> => {
  return handleServerAction(async () => {
    const data = await fetchSessionAttendanceRoster(type, groupId, sessionId);
    return {
      error: false,
      data,
      message: "Roster de asistencia obtenido exitosamente",
    };
  });
};
