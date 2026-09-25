"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
// Usando updateTag en vez de revalidateTag según la instruccón
import { updateTag } from "next/cache";

interface CreateMatchPayload {
  homeTeamSeasonCategoryId?: string | null;
  awayTeamSeasonCategoryId?: string | null;
  locationId?: string | null;
  homeTeamId: string;
  awayTeamId: string;
  startDate: string;
  endDate: string;
  type: string;
  homeScore?: number | null;
  awayScore?: number | null;
  result?: string;
}

export const createMatch = async (
  payload: CreateMatchPayload,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: any }>(
      "matches",
      payload,
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido creado exitosamente",
    };
  });
};
