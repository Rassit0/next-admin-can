"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeam } from "@/modules/teams";
import { handleServerAction } from "@/utils";

export const addTeam = async (data: {
  name: string;
  description: string | null;
  clubId: string;
}): Promise<ServiceResponse<ITeam>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ITeam }>(
      `teams`,
      data,
    );

    updateTag("teams");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo agregado exitosamente",
    };
  });
};
