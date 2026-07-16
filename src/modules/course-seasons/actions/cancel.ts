"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourseSeason } from "@/modules/course-seasons";

export const cancelCourseSeason = async (
  id: string,
  reason: string,
): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICourseSeason }>(
      `course-seasons/${id}/cancel`,
      { reason },
    );

    console.log(response);
    updateTag("course-seasons");
    return {
      error: false,
      data: {
        ...response.data,
        startDate: new Date(response.data.season.startDate),
        endDate: new Date(response.data.season.endDate),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      },
      message:
        response.message || "Temporada del equipo cancelada exitosamente",
    };
  });
};
