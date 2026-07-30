"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountingDashboardSummary } from "../interfaces/dashboard.interface";

export const getAccountingDashboardSummary = async (): Promise<ServiceResponse<IAccountingDashboardSummary>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message?: string; data: IAccountingDashboardSummary }>("accounting-dashboard/summary", {
      next: {
        tags: ["accounting-dashboard", "accounting-dashboard-summary", "account-charges"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: res.data,
      message: res.message || "Resumen obtenido exitosamente",
    };
  });
};
