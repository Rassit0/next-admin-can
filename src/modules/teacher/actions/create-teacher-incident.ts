"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { postGroupSessionIncident } from "../api/teacher.api";
import {
  CreateTeacherIncidentInput,
  TeacherIncidentItem,
} from "../interfaces/teacher.interface";

export const createTeacherIncident = async (
  type: string,
  groupId: string,
  sessionId: string,
  payload: CreateTeacherIncidentInput,
): Promise<ServiceResponse<TeacherIncidentItem>> => {
  return handleServerAction(async () => {
    const data = await postGroupSessionIncident(type, groupId, sessionId, payload);
    return {
      error: false,
      data,
      message: "Incidente registrado correctamente.",
    };
  });
};
