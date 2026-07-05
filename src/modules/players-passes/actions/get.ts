import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import {
  IPlayersPassesResponse,
  PlayerPassStatus,
} from "@/modules/players-passes";
import { handleServerAction } from "@/utils";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  status?: "ACTIVE" | "INACTIVE" | "all";
  playerId?: string;
  disciplineId?: string;
}

export const getPlayerPasses = async ({
  search,
  per_page = "5",
  page = "1",
  status = "all",
  playerId,
  disciplineId,
}: SearchParams): Promise<ServiceResponse<IPlayersPassesResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (status) params.set("status", status);
    if (playerId) params.set("playerId", playerId);
    if (disciplineId) params.set("disciplineId", disciplineId);

    console.log("url", `player-passes?${params.toString()}`);
    const res = await api.get<IPlayersPassesResponse>(
      `player-passes?${params.toString()}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          // tags: ["player-passes"],
          // revalidate: 3600,
        },
      },
    );

    const playerPasses = res.data.map((playerPass) => ({
      ...playerPass,
      startDate: new Date(playerPass.startDate),
      endDate: playerPass.endDate ? new Date(playerPass.endDate) : null,
      player: {
        ...playerPass.player,
        person: {
          ...playerPass.player.person,
          birthDate: playerPass.player.person.birthDate
            ? new Date(playerPass.player.person.birthDate)
            : null,
          createdAt: new Date(playerPass.player.person.createdAt),
          updatedAt: new Date(playerPass.player.person.updatedAt),
        },
        createdAt: new Date(playerPass.player.createdAt),
        updatedAt: new Date(playerPass.player.updatedAt),
      },
    }));
    return {
      error: false,
      data: { ...res, data: playerPasses },
      message: "Pases de jugadores obtenidos exitosamente",
    };
  });
};
