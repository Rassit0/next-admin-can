"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchDashboardMatches } from "../api/dashboard.api";
import { IDashboardMatchItem } from "../interfaces/dashboard.interface";

export const getDashboardMatches = async (
  params?: { limit?: number },
): Promise<ServiceResponse<IDashboardMatchItem[]>> => {
  return handleServerAction(async () => {
    const data = await fetchDashboardMatches(params);
    return {
      error: false,
      data,
      message: "Partidos obtenidos exitosamente",
    };
  });
};
