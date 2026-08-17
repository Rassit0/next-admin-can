"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountingDashboardSummary } from "../interfaces/dashboard.interface";

interface GetSummaryParams {
  start?: string;
  end?: string;
}

export const getAccountingDashboardSummary = async (
  params?: GetSummaryParams,
): Promise<ServiceResponse<IAccountingDashboardSummary>> => {
  return handleServerAction(async () => {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);

    const query = searchParams.toString();
    const endpoint = query
      ? `accounting-dashboard/summary?${query}`
      : "accounting-dashboard/summary";

    const res = await api.get<{
      message?: string;
      data: IAccountingDashboardSummary;
    }>(endpoint, {
      next: {
        tags: [
          "accounting-dashboard",
          "accounting-dashboard-summary-v3",
          "account-charges",
          "transactions",
          "charges",
          "cash-closures",
          "internal-transfers",
          "financial-accounts",
        ],
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
