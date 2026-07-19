"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICoursesResponse } from "../interfaces/course.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  schoolId?: string;
  callbackUrl?: string;
}

export const getCourses = async ({
  search,
  per_page = "5",
  page = "1",
  schoolId,
}: SearchParams): Promise<ServiceResponse<ICoursesResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (schoolId) params.set("schoolId", schoolId);

    const res = await api.get<ICoursesResponse>(
      `courses?${params.toString()}`,
      {
        next: {
          tags: ["courses"],
          revalidate: 3600,
        },
      },
    );

    const data = res.data.map((course) => ({
      ...course,
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Equipos obtenidos exitosamente",
    };
  });
};
