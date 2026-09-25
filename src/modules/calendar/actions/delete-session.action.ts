"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const deleteSession = async (
  id: string,
  scope: "single" | "following" | "all" = "single",
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: any }>(
      `sessions/${id}?scope=${scope}`,
    );

    updateTag("calendar");

    return {
      error: false,
      data: res.data,
      message: res.message || "Sesón eliminada exitosamente",
    };
  });
};
