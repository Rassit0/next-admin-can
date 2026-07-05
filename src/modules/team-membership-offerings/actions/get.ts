import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  ITeamSeasonResponse,
  StatusTeamSeason,
} from "@/modules/team-membership-offerings";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  orderBy?: "asc" | "desc";
  teamId?: string;
  status?: StatusTeamSeason;
  callbackUrl?: string;
}

export const getTeamSeasons = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "createdAt",
  orderBy = "desc",
  status,
  teamId,
}: SearchParams): Promise<ServiceResponse<ITeamSeasonResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);
    if (teamId) params.set("teamId", teamId);
    if (status) params.set("status", status);

    const res = await api.get<ITeamSeasonResponse>(
      `team-seasons?${params.toString()}`,
      {
        next: {
          tags: ["team-seasons"],
          revalidate: 3600,
        },
      },
    );

    const data = res.data.map((teamSeason) => ({
      ...teamSeason,
      startDate: new Date(teamSeason.startDate),
      endDate: new Date(teamSeason.endDate),
      createdAt: new Date(teamSeason.createdAt),
      updatedAt: new Date(teamSeason.updatedAt),
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
