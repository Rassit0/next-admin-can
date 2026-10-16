"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchTeacherLocations } from "../api/teacher.api";
import { TeacherLocation } from "../interfaces/teacher.interface";

export const getTeacherLocations = async (): Promise<
  ServiceResponse<TeacherLocation[]>
> => {
  return handleServerAction(async () => {
    const data = await fetchTeacherLocations();
    return {
      error: false,
      data,
      message: "Ubicaciones obtenidas correctamente.",
    };
  });
};
