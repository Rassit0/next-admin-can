"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface AvailableCycle {
  cycleStartDate: string;
  cycleEndDate: string;
  isEnrolled?: boolean;
}

export const getAvailableCycles = async (
  membershipId: string,
): Promise<ServiceResponse<AvailableCycle[]>> => {
  return handleServerAction(async () => {
    const response = await api.get<{ data: AvailableCycle[]; message: string }>(
      `student-charges/advance/${membershipId}/available-cycles`,
    );

    return {
      error: false,
      data: response.data,
      message: response.message || "Ciclos disponibles obtenidos exitosamente",
    };
  });
};
