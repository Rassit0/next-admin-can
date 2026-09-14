"use server";

import { api } from "@/modules/web/core/api/api";
import { handleServerAction } from "@/modules/web/core/utils/handleServerAction";
import { Team } from "@/modules/web/teams/components/teams-screen";

import { ServiceResponse } from "@/modules/web/core/utils/handleServerAction";

export const getPublicTeams = async (
  isHistorical: boolean = false,
): Promise<ServiceResponse<Team[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: Team[] }>(
      `public/team-seasons?isHistorical=${isHistorical}`,
      {
        next: {
          tags: ["public-teams"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Equipos públicos obtenidos exitosamente",
    };
  });
};
