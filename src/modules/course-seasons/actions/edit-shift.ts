"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICourseSeason } from "@/modules/course-seasons";
import { handleServerAction } from "@/utils";
import { Gender } from "@/modules/course-seasons";

export const editShiftAction = async (
  courseSeasonId: string,
  shiftId: string,
  data: { 
    categoryId?: string;
    gender?: Gender;
    validateAge?: boolean;
    minBirthYear?: number | null;
    maxBirthYear?: number | null;
    maxMembers?: number; 
    minMembers?: number;
  }
): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICourseSeason }>(
      `course-seasons/${courseSeasonId}/shifts/${shiftId}`,
      data
    );

    updateTag("course-seasons");
    return {
      error: false,
      message: response.message || "Configuración del turno actualizada exitosamente",
      data: response.data,
    };
  });
};
