import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITeamsResponse } from "../interfaces/team.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  clubId?: string;
  callbackUrl?: string;
}

export const getTeams = async ({
  search,
  per_page = "5",
  page = "1",
  clubId,
}: SearchParams): Promise<ServiceResponse<ITeamsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (clubId) params.set("clubId", clubId);

    const res = await api.get<ITeamsResponse>(`teams?${params.toString()}`, {
      next: {
        tags: ["teams"],
        revalidate: 3600,
      },
    });

    const data = res.data.map((team) => ({
      ...team,
      createdAt: new Date(team.createdAt),
      updatedAt: new Date(team.updatedAt),
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
