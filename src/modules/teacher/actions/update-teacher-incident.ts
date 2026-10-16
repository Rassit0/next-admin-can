"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { patchGroupSessionIncident } from "../api/teacher.api";
import {
  UpdateTeacherIncidentInput,
  TeacherIncidentItem,
} from "../interfaces/teacher.interface";

export const updateTeacherIncident = async (
  type: string,
  groupId: string,
  sessionId: string,
  incidentId: string,
  payload: UpdateTeacherIncidentInput,
): Promise<ServiceResponse<TeacherIncidentItem>> => {
  return handleServerAction(async () => {
    const data = await patchGroupSessionIncident(
      type,
      groupId,
      sessionId,
      incidentId,
      payload,
    );
    return {
      error: false,
      data,
      message: "Incidente actualizado correctamente.",
    };
  });
};
