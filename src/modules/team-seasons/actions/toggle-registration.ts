"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeamSeason } from "@/modules/team-seasons";
import { handleServerAction } from "@/utils";

export const toggleTeamSeasonRegistration = async (
  id: string,
  isOpen: boolean
): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
      { isRegistrationOpen: isOpen }
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || (isOpen ? "Inscripciones abiertas" : "Inscripciones cerradas"),
    };
  });
};
