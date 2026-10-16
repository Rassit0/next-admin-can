"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchDashboardSummary } from "../api/dashboard.api";
import {
  IDashboardSummary,
  IDashboardSummaryParams,
} from "../interfaces/dashboard.interface";

export const getDashboardSummary = async (
  params?: IDashboardSummaryParams,
): Promise<ServiceResponse<IDashboardSummary>> => {
  return handleServerAction(async () => {
    // Validación básica de parámetros de consulta
    if (params?.from && isNaN(Date.parse(params.from))) {
      return {
        error: true,
        statusCode: 400,
        message: "El parámetro 'from' debe ser una fecha ISO válida.",
      };
    }

    if (params?.to && isNaN(Date.parse(params.to))) {
      return {
        error: true,
        statusCode: 400,
        message: "El parámetro 'to' debe ser una fecha ISO válida.",
      };
    }

    const data = await fetchDashboardSummary(params);

    return {
      error: false,
      data,
      message: "Resumen del Dashboard obtenido exitosamente",
    };
  });
};
