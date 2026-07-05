"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamCategory, ProgramGender } from "@/modules/team-categories";

export const addTeamCategory = async (data: {
  teamId: string;
  categoryId: string;
  gender: ProgramGender;
}): Promise<ServiceResponse<ITeamCategory>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ITeamCategory }>(
      `team-categories`,
      data,
    );

    updateTag("team-categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria asignada a equipo exitosamente",
    };
  });
};
