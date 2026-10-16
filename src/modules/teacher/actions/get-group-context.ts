"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchTeacherGroupContext } from "../api/teacher.api";
import { TeacherGroupContext } from "../interfaces/teacher.interface";

export const getGroupContext = async (
  type: string,
  groupId: string,
): Promise<ServiceResponse<TeacherGroupContext>> => {
  return handleServerAction(async () => {
    const data = await fetchTeacherGroupContext(type, groupId);
    return {
      error: false,
      data,
      message: "Contexto del grupo obtenido exitosamente",
    };
  });
};
