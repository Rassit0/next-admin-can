"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamSeasonStaff } from "@/modules/team-season-staff";

export const removeTeamSeasonStaff = async (
  id: string,
): Promise<ServiceResponse<ITeamSeasonStaff>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: ITeamSeasonStaff;
    }>(`team-season-staff/${id}`);

    updateTag("team-season-staff");
    return {
      error: false,
      data: response.data,
      message: response.message || "Personal removido exitosamente",
    };
  });
};
