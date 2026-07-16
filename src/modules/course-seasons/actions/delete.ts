"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourseSeason } from "@/modules/course-seasons";

export const deleteCourseSeason = async (
  id: string,
): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ICourseSeason }>(
      `course-seasons/${id}`,
    );

    updateTag("course-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada eliminada exitosamente",
    };
  });
};
