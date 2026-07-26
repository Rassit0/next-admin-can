"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICourseSeasonStaffResponse } from "../interfaces";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  orderBy?: string;
  courseSeasonId?: string;
  role?: string;
}

export const getCourseSeasonStaff = async ({
  search,
  per_page = "10",
  page = "1",
  orderBy = "asc",
  courseSeasonId,
  role,
}: SearchParams): Promise<ServiceResponse<ICourseSeasonStaffResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (orderBy) params.set("orderBy", orderBy);
    if (courseSeasonId) params.set("courseSeasonId", courseSeasonId);
    if (role) params.set("role", role);

    const res = await api.get<ICourseSeasonStaffResponse>(
      `course-season-staff?${params.toString()}`,
      {
        next: {
          tags: ["course-season-staff"],
        },
      },
    );

    return {
      error: false,
      data: res,
      message: (res as any).message || "Personal del curso obtenido exitosamente",
    };
  });
};
