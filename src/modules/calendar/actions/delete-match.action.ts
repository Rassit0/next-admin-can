"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const deleteMatch = async (
  id: string,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: any }>(
      `matches/${id}`,
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido eliminado exitosamente",
    };
  });
};
