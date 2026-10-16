"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchDashboardActivity } from "../api/dashboard.api";
import {
  IDashboardActivityResponse,
  IDashboardActivityParams,
} from "../interfaces/dashboard.interface";

export const getDashboardActivity = async (
  params?: IDashboardActivityParams,
): Promise<ServiceResponse<IDashboardActivityResponse>> => {
  return handleServerAction(async () => {
    if (params?.limit && (params.limit < 1 || params.limit > 50)) {
      return {
        error: true,
        statusCode: 400,
        message: "El parámetro 'limit' debe ser un número entre 1 y 50.",
      };
    }

    const data = await fetchDashboardActivity(params);

    return {
      error: false,
      data,
      message: "Actividad reciente obtenida exitosamente",
    };
  });
};
