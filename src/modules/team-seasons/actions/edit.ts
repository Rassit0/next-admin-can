"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPostTeamSeason, ITeamSeason } from "@/modules/team-seasons";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: IPostTeamSeason;
}

export const editTeamSeason = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
      data,
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada editada exitosamente",
    };
  });
};
