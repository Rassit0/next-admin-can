"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { patchGroupSession } from "../api/teacher.api";
import {
  UpdateTeacherSessionInput,
  TeacherGroupSession,
} from "../interfaces/teacher.interface";

export const updateTeacherSession = async (
  type: string,
  groupId: string,
  sessionId: string,
  payload: UpdateTeacherSessionInput,
): Promise<ServiceResponse<TeacherGroupSession>> => {
  return handleServerAction(async () => {
    const data = await patchGroupSession(type, groupId, sessionId, payload);
    return {
      error: false,
      data,
      message: "Sesión actualizada correctamente.",
    };
  });
};
