"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchTeacherContext } from "../api/teacher.api";
import { StaffContextData } from "../interfaces/teacher.interface";

export const getTeacherContext = async (): Promise<
  ServiceResponse<StaffContextData>
> => {
  return handleServerAction(async () => {
    const data = await fetchTeacherContext();
    return {
      error: false,
      data,
      message: "Contexto de staff obtenido exitosamente",
    };
  });
};
