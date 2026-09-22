"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

interface UpdateMatchPayload {
  homeTeamSeasonCategoryId?: string | null;
  awayTeamSeasonCategoryId?: string | null;
  locationId?: string | null;
  homeTeamId?: string;
  awayTeamId?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  homeScore?: number | null;
  awayScore?: number | null;
}

export const updateMatch = async (
  id: string,
  payload: UpdateMatchPayload,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: any }>(
      `matches/${id}`,
      payload,
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido actualizado exitosamente",
    };
  });
};
