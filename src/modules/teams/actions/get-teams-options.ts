"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface ITeamOption {
  id: string;
  name: string;
  club: {
    id: string;
    name: string;
    isExternal: boolean;
    discipline?: {
      name: string;
    };
  };
}

export const getTeamsOptions = async (): Promise<
  ServiceResponse<ITeamOption[]>
> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeamOption[] }>(
      `teams/options`,
      {
        next: {
          tags: ["teams"],
          revalidate: 0,
        },
      },
    );

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Equipos obtenidos exitosamente",
    };
  });
};
