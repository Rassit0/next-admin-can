import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { IPlayersResponse } from "@/modules/players";
import { handleServerAction } from "@/utils";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  orderBy?: string;
}

export const getPlayers = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "name",
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<IPlayersResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IPlayersResponse>(
      `players?${params.toString()}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["players", "persons"],
          revalidate: 3600,
        },
      },
    );

    const players = res.data.map((player) => ({
      ...player,
      person: {
        ...player.person,
        birthDate: player.person.birthDate
          ? new Date(player.person.birthDate)
          : null,
        createdAt: new Date(player.person.createdAt),
        updatedAt: new Date(player.person.updatedAt),
      },
    }));
    return {
      error: false,
      data: { ...res, data: players },
      message: "Jugadores obtenidos exitosamente",
    };
  });
};
