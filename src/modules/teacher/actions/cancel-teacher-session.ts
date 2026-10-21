"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";
import { cancelGroupSession as apiCancelSession } from "../api/teacher.api";
import { TeacherGroupSession } from "../interfaces/teacher.interface";

export const cancelTeacherSession = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<ServiceResponse<TeacherGroupSession>> => {
  return handleServerAction(async () => {
    const data = await apiCancelSession(type, groupId, sessionId);

    updateTag("calendar");
    updateTag("sessions");
    updateTag("teacher-sessions");
    updateTag("staff-groups");

    return {
      error: false,
      data,
      message: "Sesión cancelada correctamente.",
    };
  });
};
