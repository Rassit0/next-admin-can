"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { postGroupSession } from "../api/teacher.api";
import {
  CreateTeacherSessionInput,
  TeacherGroupSession,
} from "../interfaces/teacher.interface";

export const createTeacherSession = async (
  type: string,
  groupId: string,
  payload: CreateTeacherSessionInput,
): Promise<ServiceResponse<TeacherGroupSession>> => {
  return handleServerAction(async () => {
    const data = await postGroupSession(type, groupId, payload);
    return {
      error: false,
      data,
      message: "Sesión creada correctamente.",
    };
  });
};
