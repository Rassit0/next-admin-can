"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { api } from "@/utils/api";

interface CreateCourseSeasonPauseDto {
  courseSeasonId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ICourseSeasonPause {
  id: string;
  courseSeasonId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
}

export const createCourseSeasonPause = async (
  data: CreateCourseSeasonPauseDto,
): Promise<ServiceResponse<ICourseSeasonPause>> => {
  return handleServerAction(async () => {
    const { courseSeasonId, ...payload } = data;
    const res = await api.post<{ message: string; data: ICourseSeasonPause }>(
      `course-seasons/${courseSeasonId}/pauses`,
      payload,
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Pausa de temporada registrada exitosamente",
    };
  });
};
