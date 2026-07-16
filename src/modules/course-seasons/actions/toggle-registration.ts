"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICourseSeason } from "@/modules/course-seasons";
import { handleServerAction } from "@/utils";

export const toggleCourseSeasonRegistration = async (
  id: string,
  isOpen: boolean
): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICourseSeason }>(
      `course-seasons/${id}`,
      { isRegistrationOpen: isOpen }
    );

    updateTag("course-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || (isOpen ? "Inscripciones abiertas" : "Inscripciones cerradas"),
    };
  });
};
