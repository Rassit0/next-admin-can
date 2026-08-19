"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICourseSeason } from "@/modules/course-seasons";
import { handleServerAction } from "@/utils";

export const addShiftAction = async (
  id: string,
  data: { shiftId: string; maxMembers: number; minMembers: number }
): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ICourseSeason }>(
      `course-seasons/${id}/add-shift`,
      data
    );

    updateTag("course-seasons");
    return {
      error: false,
      message: response.message || "Turno agregado exitosamente",
      data: response.data,
    };
  });
};
