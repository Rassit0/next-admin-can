"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

interface CreateSessionPayload {
  locationId?: string | null;
  title?: string | null;
  startDate: string;
  endDate: string;
  durationMin?: number;
  teamSeasonCategoryIds?: string[];
  courseSeasonShiftIds?: string[];
  recurrenceRule?: string;
  timezone?: string;
}

export const createSession = async (
  payload: CreateSessionPayload,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: any }>(
      "sessions",
      payload,
    );

    updateTag("calendar");

    return {
      error: false,
      data: res.data,
      message: res.message || "Sesión creada exitosamente",
    };
  });
};
