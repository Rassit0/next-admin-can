"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Team } from "@/modules/team-seasons";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamContext = async ({
  id,
}: SearchParams): Promise<ServiceResponse<Team>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: Team }>(
      `team-seasons/team/context/${id}`,
      {
        next: {
          tags: ["teams"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: "Club obtenido exitosamente",
    };
  });
};
