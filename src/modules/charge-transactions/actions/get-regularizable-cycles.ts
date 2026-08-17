"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface RegularizableCycle {
  id: string;
  cycleId: string;
  seasonId: string;
  cycleStart: string;
  cycleEnd: string;
  year: number;
  month: number;
  amount: number;
  sequence: number;
  status: string;
  title: string;
}

export const getRegularizableCycles = async (
  type: "membership" | "student",
  membershipId: string,
): Promise<ServiceResponse<RegularizableCycle[]>> => {
  return handleServerAction(async () => {
    const endpoint =
      type === "membership"
        ? `membership-charges/${membershipId}/regularizable-cycles`
        : `student-charges/${membershipId}/regularizable-cycles`;
        
    const response = await api.get<any>(endpoint);
    
    // Si el backend devuelve un arreglo directo o está envuelto en { data }
    const rawCycles = Array.isArray(response) ? response : (response?.data || []);

    const mappedCycles = rawCycles.map((c: any) => ({
      id: c.cycleId,
      cycleId: c.cycleId,
      seasonId: c.seasonId || "",
      cycleStart: c.cycleStartDate,
      cycleEnd: c.cycleEndDate,
      year: c.billingYear,
      month: c.billingMonth,
      amount: c.netAmount,
      sequence: c.billingCycle,
      status: "PENDING",
      title: c.title || c.description || `Ciclo: ${c.billingYear} - Mes ${c.billingMonth}`
    }));

    return {
      error: false,
      data: mappedCycles,
      message: response.message || "Ciclos obtenidos exitosamente",
    };
  });
};
