import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IClubsResponse } from "../interfaces/club.interface";
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

export const getClubs = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "name",
  disciplineId,
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<IClubsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);
    if (disciplineId) params.set("disciplineId", disciplineId);

    const res = await api.get<IClubsResponse>(`clubs?${params.toString()}`, {
      next: {
        // tags: ["clubs"],
        // revalidate: 3600,
      },
    });

    const data = res.data.map((club) => ({
      ...club,
      createdAt: new Date(club.createdAt),
      updatedAt: new Date(club.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Clubes obtenidos exitosamente",
    };
  });
};
