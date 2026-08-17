"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

export interface RegularizeHistoricalChargeData {
  type: "membership" | "student";
  membershipId: string;
  cycleId: string;
  overrideAmount?: number;
}

export const regularizeHistoricalCharge = async (
  data: RegularizeHistoricalChargeData,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const endpoint =
      data.type === "membership"
        ? `membership-charges/${data.membershipId}/regularize`
        : `student-charges/${data.membershipId}/regularize`;

    const body = {
      cycleId: data.cycleId,
      ...(data.overrideAmount !== undefined && { overrideAmount: data.overrideAmount }),
    };

    const response = await api.post<{
      message?: string;
      data: any;
    }>(endpoint, body);

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Regularización histórica creada exitosamente",
    };
  });
};
