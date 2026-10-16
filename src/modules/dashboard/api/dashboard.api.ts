import { api } from "@/utils/api";
import {
  IDashboardSummary,
  IDashboardSummaryParams,
  IDashboardActivityResponse,
  IDashboardMatchItem,
} from "../interfaces/dashboard.interface";

export const fetchDashboardSummary = async (
  params?: IDashboardSummaryParams,
): Promise<IDashboardSummary> => {
  const queryParams: Record<string, string> = {};
  if (params?.from) queryParams.from = params.from;
  if (params?.to) queryParams.to = params.to;

  const res = await api.get<IDashboardSummary | { data: IDashboardSummary }>(
    "dashboard/summary",
    {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      next: {
        tags: ["dashboard", "dashboard-summary"],
        revalidate: 60,
      },
    },
  );

  // Normalizar en caso de que la respuesta venga envuelta en { data: ... }
  if (res && typeof res === "object" && "data" in res && (res as any).data?.period) {
    return (res as any).data;
  }

  return res as IDashboardSummary;
};

export const fetchDashboardActivity = async (
  params?: { limit?: number },
): Promise<IDashboardActivityResponse> => {
  const queryParams: Record<string, string> = {};
  if (params?.limit) queryParams.limit = String(params.limit);

  const res = await api.get<
    IDashboardActivityResponse | { data: IDashboardActivityResponse }
  >("dashboard/activity", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    next: {
      tags: ["dashboard", "dashboard-activity", "audit-logs"],
      revalidate: 30,
    },
  });

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.items
  ) {
    return (res as any).data;
  }

  return res as IDashboardActivityResponse;
};

export const fetchDashboardMatches = async (
  params?: { limit?: number },
): Promise<IDashboardMatchItem[]> => {
  const limit = params?.limit || 3;
  const res = await api.get<any>("matches", {
    params: {
      per_page: String(limit),
      sortField: "matchDate",
      orderBy: "desc",
    },
    next: {
      tags: ["dashboard", "dashboard-matches", "matches"],
      revalidate: 60,
    },
  });

  if (res && typeof res === "object") {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
  }

  return [];
};
