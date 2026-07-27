"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeam } from "../interfaces/team.interface";

export const deleteTeam = async (
  id: string,
): Promise<ServiceResponse<ITeam>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ITeam }>(
      `teams/${id}`,
    );

    updateTag("teams");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo eliminado exitosamente",
    };
  });
};
