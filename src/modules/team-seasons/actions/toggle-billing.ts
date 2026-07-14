"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

export const toggleBillingEngineTeamSeason = async (
  id: string,
  isEngineActive: boolean,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: any }>(
      `team-seasons/${id}/toggle-billing-engine`,
      { isEngineActive },
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Motor de cobros actualizado exitosamente",
    };
  });
};
