"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Gender, ITeamSeasonsResponse } from "@/modules/team-seasons";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  gender?: Gender;
  teamId?: string;
  categoryId?: string;
  seasonId?: string;
  callbackUrl?: string;
  sortField?: string;
  orderBy?: string;
}

export const getTeamSeasons = async ({
  search,
  per_page = "5",
  page = "1",
  gender,
  teamId,
  categoryId,
  seasonId,
  sortField = "createdAt",
  orderBy = "desc",
}: SearchParams): Promise<ServiceResponse<ITeamSeasonsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (gender) params.set("gender", gender);
    if (teamId) params.set("teamId", teamId);
    if (categoryId) params.set("categoryId", categoryId);
    if (seasonId) params.set("seasonId", seasonId);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<ITeamSeasonsResponse>(
      `team-seasons?${params.toString()}`,
      {
        next: {
          // tags: ["team-seasons"],
          // revalidate: 3600,
        },
      },
    );

    const data = res.data.map((teamSeason) => ({
      ...teamSeason,
      season: {
        ...teamSeason.season,
        startDate: new Date(teamSeason.season.startDate),
        endDate: new Date(teamSeason.season.endDate),
      },
      createdAt: new Date(teamSeason.createdAt),
      updatedAt: new Date(teamSeason.updatedAt),
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
