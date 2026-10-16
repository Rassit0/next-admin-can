"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { patchGroupEvaluation } from "../api/teacher.api";
import {
  TeacherEvaluationItem,
  UpdateTeacherEvaluationInput,
} from "../interfaces/teacher.interface";

export const updateGroupEvaluation = async (
  type: string,
  groupId: string,
  evaluationId: string,
  payload: UpdateTeacherEvaluationInput,
): Promise<ServiceResponse<TeacherEvaluationItem>> => {
  return handleServerAction(async () => {
    const data = await patchGroupEvaluation(
      type,
      groupId,
      evaluationId,
      payload,
    );
    return {
      error: false,
      data,
      message: "Evaluación actualizada correctamente.",
    };
  });
};
