"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface CycleCapacity {
  cycleStartDate: string;
  cycleEndDate: string;
  shiftId: string;
  shiftName: string;
  maxMembers: number | null;
  occupiedSpots: number;
  availableSpots: number | null;
  status: "AVAILABLE" | "FULL";
}

export const getCycleCapacity = async (
  courseSeasonId: string,
  shiftId?: string,
): Promise<ServiceResponse<CycleCapacity[]>> => {
  return handleServerAction(async () => {
    const url = shiftId
      ? `student-charges/course-seasons/${courseSeasonId}/cycle-capacity?shiftId=${shiftId}`
      : `student-charges/course-seasons/${courseSeasonId}/cycle-capacity`;

    const response = await api.get<{ data: CycleCapacity[], message: string }>(url);

    return {
      error: false,
      data: response.data,
      message: response.message || "Capacidad obtenida exitosamente",
    };
  });
};
