"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

interface UpdateSessionPayload {
  locationId?: string | null;
  title?: string | null;
  startDate?: string;
  endDate?: string;
  durationMin?: number;
  teamSeasonCategoryIds?: string[];
  courseSeasonShiftIds?: string[];
  recurrenceRule?: string;
  timezone?: string;
}

export const updateSession = async (
  id: string,
  payload: UpdateSessionPayload,
  scope: "single" | "following" | "all" = "single",
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: any }>(
      `sessions/${id}?scope=${scope}`,
      payload,
    );

    updateTag("calendar");

    return {
      error: false,
      data: res.data,
      message: res.message || "Sesión actualizada exitosamente",
    };
  });
};
