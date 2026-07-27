"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITeam } from "../interfaces/team.interface";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ITeam>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeam }>(`teams/${id}`, {
      next: {
        tags: ["teams"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Equipo obtenido exitosamente",
    };
  });
};
