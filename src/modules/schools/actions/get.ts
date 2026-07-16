import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISchoolsResponse } from "../interfaces/school.interface";
import { updateTag } from "next/cache";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  disciplineId?: string;
  orderBy?: "asc" | "desc";
  callbackUrl?: string;
}

export const getSchools = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "name",
  disciplineId,
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<ISchoolsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);
    if (disciplineId) params.set("disciplineId", disciplineId);

    const res = await api.get<ISchoolsResponse>(`schools?${params.toString()}`, {
      next: {
        // tags: ["schools"],
        // revalidate: 3600,
      },
    });

    const data = res.data.map((school) => ({
      ...school,
      createdAt: new Date(school.createdAt),
      updatedAt: new Date(school.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Schooles obtenidos exitosamente",
    };
  });
};
