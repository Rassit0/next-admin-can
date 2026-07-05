"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeamCategory, ProgramGender } from "@/modules/team-categories";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    teamId: string;
    categoryId: string;
    gender: ProgramGender;
  };
}

export const editTeam = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ITeamCategory>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamCategory }>(
      `team-categories/${id}`,
      data,
    );

    updateTag("team-categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria de equipo editada exitosamente",
    };
  });
};
