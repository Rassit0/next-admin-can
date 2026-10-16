"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchTeacherDashboard } from "../api/teacher.api";
import { TeacherDashboardData } from "../interfaces/teacher.interface";

export const getTeacherDashboard = async (): Promise<
  ServiceResponse<TeacherDashboardData>
> => {
  return handleServerAction(async () => {
    const data = await fetchTeacherDashboard();
    return {
      error: false,
      data,
      message: "Dashboard de profesor obtenido exitosamente",
    };
  });
};
