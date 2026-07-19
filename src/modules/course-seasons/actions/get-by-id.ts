"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICourseSeason } from "@/modules/course-seasons";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getCourseSeasonById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ICourseSeason }>(
      `course-seasons/${id}`,
      {
        next: {
          tags: ["course-seasons"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        season: {
          ...res.data.season,
          startDate: new Date(res.data.season.startDate),
          endDate: new Date(res.data.season.endDate),
        },
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Temporada obtenida exitosamente",
    };
  });
};
