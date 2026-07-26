"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourseSeasonStaff } from "@/modules/course-season-staff";

export const removeCourseSeasonStaff = async (
  id: string,
): Promise<ServiceResponse<ICourseSeasonStaff>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: ICourseSeasonStaff;
    }>(`course-season-staff/${id}`);

    updateTag("course-season-staff");
    return {
      error: false,
      data: response.data,
      message: response.message || "Personal removido exitosamente",
    };
  });
};
