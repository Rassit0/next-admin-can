"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourseSeasonStaff } from "@/modules/course-season-staff";

export interface UpdateCourseSeasonStaffData {
  role?: string;
  customRole?: string | null;
  startedAt?: string;
  endedAt?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
}

export const updateCourseSeasonStaff = async (
  id: string,
  data: UpdateCourseSeasonStaffData,
): Promise<ServiceResponse<ICourseSeasonStaff>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{
      message: string;
      data: ICourseSeasonStaff;
    }>(`course-season-staff/${id}`, data);

    updateTag("course-season-staff");
    return {
      error: false,
      data: response.data,
      message: response.message || "Asignación actualizada exitosamente",
    };
  });
};
