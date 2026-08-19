"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export const getCourseSeasonShiftsOptions = async (
  courseSeasonId: string,
): Promise<ServiceResponse<{ id: string; name: string }[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ data: { id: string; name: string }[], message?: string }>(
      `course-seasons/${courseSeasonId}/shifts`,
      {
        next: {
          tags: ["course-seasons"],
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Opciones de turnos obtenidas exitosamente",
    };
  });
};
