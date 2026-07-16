import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Gender, ICourseSeasonResponse } from "@/modules/course-seasons";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  gender?: Gender;
  courseId?: string;
  categoryId?: string;
  seasonId?: string;
  callbackUrl?: string;
  sortField?: string;
  orderBy?: string;
}

export const getCourseSeasons = async ({
  search,
  per_page = "5",
  page = "1",
  gender,
  courseId,
  categoryId,
  seasonId,
  sortField = "createdAt",
  orderBy = "desc",
}: SearchParams): Promise<ServiceResponse<ICourseSeasonResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (gender) params.set("gender", gender);
    if (courseId) params.set("courseId", courseId);
    if (categoryId) params.set("categoryId", categoryId);
    if (seasonId) params.set("seasonId", seasonId);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<ICourseSeasonResponse>(
      `course-seasons?${params.toString()}`,
      {
        next: {
          // tags: ["course-seasons"],
          // revalidate: 3600,
        },
      },
    );

    const data = res.data.map((courseSeason) => ({
      ...courseSeason,
      season: {
        ...courseSeason.season,
        startDate: new Date(courseSeason.season.startDate),
        endDate: new Date(courseSeason.season.endDate),
      },
      createdAt: new Date(courseSeason.createdAt),
      updatedAt: new Date(courseSeason.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Temporadas obtenidas exitosamente",
    };
  });
};
