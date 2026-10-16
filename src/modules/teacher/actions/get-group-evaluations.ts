"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchGroupEvaluations } from "../api/teacher.api";
import { TeacherGroupEvaluationsResponse } from "../interfaces/teacher.interface";

export const getGroupEvaluations = async (
  type: string,
  groupId: string,
  participantId?: string,
): Promise<ServiceResponse<TeacherGroupEvaluationsResponse>> => {
  return handleServerAction(async () => {
    const data = await fetchGroupEvaluations(type, groupId, participantId);
    return {
      error: false,
      data,
      message: "Evaluaciones del grupo obtenidas exitosamente",
    };
  });
};
