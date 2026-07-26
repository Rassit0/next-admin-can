"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Gender, ITeamSeasonsResponse } from "@/modules/team-seasons";
import { auth } from "@/auth";

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
  const session = await auth();
  console.log("session desde getTeams:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

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
        headers: {
          Authorization: `Bearer ${session.user.token}`,
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
