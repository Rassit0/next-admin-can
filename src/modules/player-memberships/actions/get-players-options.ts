import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPlayersOptionsResponse } from "@/modules/player-memberships";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  orderBy?: string;
}

export const getPlayersOptions = async (
  { search, per_page = "10", page = "1", orderBy = "asc" }: SearchParams,
  signal?: AbortSignal,
): Promise<ServiceResponse<IPlayersOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IPlayersOptionsResponse>(
      `player-memberships/players-options?${params.toString()}`,
      {
        next: {
          tags: ["players"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
        signal,
      },
    );

    return {
      error: false,
      data: {
        ...res,
        data: res.data.map((player) => ({
          ...player,
          person: {
            ...player.person,
            birthDate: new Date(player.person.birthDate),
          },
        })),
      },
      message: res.message || "Jugadores obtenidos exitosamente",
    };
  });
};
