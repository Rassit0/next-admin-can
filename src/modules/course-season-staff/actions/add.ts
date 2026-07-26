"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourseSeasonStaff } from "@/modules/course-season-staff";

export interface AddCourseSeasonStaffData {
  courseSeasonId: string;
  staffId: string;
  role: string;
  customRole?: string | null;
  startedAt: string;
  endedAt?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
}

export const addCourseSeasonStaff = async (
  data: AddCourseSeasonStaffData,
): Promise<ServiceResponse<ICourseSeasonStaff>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: ICourseSeasonStaff;
    }>(`course-season-staff`, data);

    updateTag("course-season-staff");
    return {
      error: false,
      data: response.data,
      message: response.message || "Personal asignado exitosamente",
    };
  });
};
