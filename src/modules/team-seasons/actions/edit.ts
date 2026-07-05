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
  console.log(data);
  const formData = new FormData();
  formData.append("description", data.description || "");
  formData.append("maxMembers", data.maxMembers.toString());
  formData.append("minMembers", data.minMembers.toString());
  formData.append("teamId", data.teamId);
  formData.append("categoryId", data.categoryId);
  formData.append("seasonId", data.seasonId);
  formData.append("gender", data.gender);
  formData.append("billingDay", data.billingDay.toString());
  formData.append("registrationFee", data.registrationFee);
  formData.append("monthlyFee", data.monthlyFee);
  formData.append("debtToleranceMonths", data.debtToleranceMonths.toString());
  formData.append("lateFeeEnabled", data.lateFeeEnabled.toString());
  formData.append("lateFeePerDay", data.lateFeePerDay);
  formData.append("graceDays", data.graceDays.toString());
  formData.append("status", data.status);
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
      formData,
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada editada exitosamente",
    };
  });
};
