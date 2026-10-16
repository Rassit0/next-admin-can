"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { putBulkSessionAttendance } from "../api/teacher.api";
import {
  BulkAttendancePayload,
  BulkAttendanceResult,
} from "../interfaces/teacher.interface";

export const saveBulkAttendance = async (
  type: string,
  groupId: string,
  sessionId: string,
  payload: BulkAttendancePayload,
): Promise<ServiceResponse<BulkAttendanceResult>> => {
  return handleServerAction(async () => {
    const data = await putBulkSessionAttendance(
      type,
      groupId,
      sessionId,
      payload,
    );
    return {
      error: false,
      data,
      message: "Asistencia guardada correctamente.",
    };
  });
};
