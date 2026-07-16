import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  ICourseSeasonResponse,
  StatusCourseSeason,
} from "@/modules/course-membership-offerings";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  orderBy?: "asc" | "desc";
  courseId?: string;
  status?: StatusCourseSeason;
  callbackUrl?: string;
}

export const getCourseSeasons = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "createdAt",
  orderBy = "desc",
  status,
  courseId,
}: SearchParams): Promise<ServiceResponse<ICourseSeasonResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);
    if (courseId) params.set("courseId", courseId);
    if (status) params.set("status", status);

    const res = await api.get<ICourseSeasonResponse>(
      `course-seasons?${params.toString()}`,
      {
        next: {
          tags: ["course-seasons"],
          revalidate: 3600,
        },
      },
    );

    const data = res.data.map((courseSeason) => ({
      ...courseSeason,
      startDate: new Date(courseSeason.startDate),
      endDate: new Date(courseSeason.endDate),
      createdAt: new Date(courseSeason.createdAt),
      updatedAt: new Date(courseSeason.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Temporadas del equipo obtenidas exitosamente",
    };
  });
};
