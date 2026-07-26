"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IStaffOptionsResponse } from "../interfaces";
interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  courseSeasonId?: string;
}

export const getAvailableCourseStaffOptions = async ({
  search,
  per_page = "10",
  page = "1",
  courseSeasonId,
}: SearchParams): Promise<ServiceResponse<IStaffOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (courseSeasonId) params.set("courseSeasonId", courseSeasonId);

    const res = await api.get<IStaffOptionsResponse>(
      `course-season-staff/available?${params.toString()}`,
      {
        next: {
          tags: ["staff", "course-season-staff"],
          revalidate: 60 * 60 * 24 * 7, // 1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message:
        (res as any).message || "Personal disponible obtenido exitosamente",
    };
  });
};
