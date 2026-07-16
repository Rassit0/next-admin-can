"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPostCourseSeason, ICourseSeason } from "@/modules/course-seasons";
import { handleServerAction } from "@/utils";

export const addCourseSeason = async (
  data: IPostCourseSeason,
): Promise<ServiceResponse<ICourseSeason>> => {

  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ICourseSeason }>(
      `course-seasons`,
      data,
    );

    updateTag("course-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada asignada exitosamente",
    };
  });
};
