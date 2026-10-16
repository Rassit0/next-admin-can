"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { postGroupEvaluation } from "../api/teacher.api";
import {
  CreateTeacherEvaluationInput,
  TeacherEvaluationItem,
} from "../interfaces/teacher.interface";

export const createGroupEvaluation = async (
  type: string,
  groupId: string,
  payload: CreateTeacherEvaluationInput,
): Promise<ServiceResponse<TeacherEvaluationItem>> => {
  return handleServerAction(async () => {
    const data = await postGroupEvaluation(type, groupId, payload);
    return {
      error: false,
      data,
      message: "Evaluación registrada correctamente.",
    };
  });
};
