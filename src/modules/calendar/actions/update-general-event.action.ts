"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

interface UpdateGeneralEventPayload {
  title?: string | null;
  description?: string | null;
  startDate?: string;
  endDate?: string;
  locationId?: string | null;
  color?: string | null;
  institutionId?: string | null;
  teamSeasonCategoryId?: string | null;
  courseSeasonId?: string | null;
  courseSeasonShiftId?: string | null;
  recurrenceRule?: string | null;
  timezone?: string | null;
}

export const updateGeneralEvent = async (
  id: string,
  payload: UpdateGeneralEventPayload,
  scope: "single" | "following" | "all" = "single"
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: any }>(
      `events/general/${id}?scope=${scope}`,
      payload,
    );

    updateTag("calendar");

    return {
      error: false,
      data: res.data,
      message: res.message || "Evento general actualizado exitosamente",
    };
  });
};
