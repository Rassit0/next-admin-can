"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";
import { postGroupSession } from "../api/teacher.api";
import {
  CreateTeacherSessionInput,
  TeacherGroupSession,
} from "../interfaces/teacher.interface";

export const createTeacherSession = async (
  type: string,
  groupId: string,
  payload: CreateTeacherSessionInput,
): Promise<ServiceResponse<TeacherGroupSession | TeacherGroupSession[]>> => {
  return handleServerAction(async () => {
    const data = await postGroupSession(type, groupId, payload);

    updateTag("calendar");
    updateTag("sessions");
    updateTag("teacher-sessions");
    updateTag("staff-groups");

    return {
      error: false,
      data,
      message: payload.recurrenceRule
        ? "Serie de sesiones programada correctamente."
        : "Sesión creada correctamente.",
    };
  });
};
