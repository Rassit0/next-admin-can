import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPlayerPassActiveOptionsResponse } from "@/modules/players-passes";

interface Props {
  playerId: string;
}

export const getActivePassesOptions = async ({
  playerId,
}: Props): Promise<ServiceResponse<IPlayerPassActiveOptionsResponse>> => {
  const query = new URLSearchParams();
  if (playerId) {
    query.append("playerId", playerId);
  }

  return handleServerAction(async () => {
    const res = await api.get<IPlayerPassActiveOptionsResponse>(
      `player-passes/active/options?${query.toString()}`,
      {
        next: {
          tags: ["player-passes"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message:
        res.message || "Opciones de pases activos obtenidos exitosamente",
    };
  });
};
