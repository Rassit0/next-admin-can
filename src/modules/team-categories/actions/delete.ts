"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamCategory } from "@/modules/team-categories";

export const deleteTeam = async (
  id: string,
): Promise<ServiceResponse<ITeamCategory>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ITeamCategory }>(
      `team-categories/${id}`,
    );

    updateTag("team-categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria de equipo eliminada exitosamente",
    };
  });
};
