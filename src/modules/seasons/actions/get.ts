import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonsResponse } from "../interfaces/season.interface";
import { updateTag } from "next/cache";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: "name" | "startDate" | "endDate" | "createdAt" | "updatedAt";
  orderBy?: "asc" | "desc";
  callbackUrl?: string;
}

export const getSeasons = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "name",
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<ISeasonsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<ISeasonsResponse>(
      `seasons?${params.toString()}`,
      {
        next: {
          tags: ["seasons"],
          revalidate: 3600,
        },
      },
    );

    const data = res.data.map((season) => ({
      ...season,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      createdAt: new Date(season.createdAt),
      updatedAt: new Date(season.updatedAt),
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
