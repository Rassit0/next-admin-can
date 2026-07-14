"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPreviewChargesResponse } from "@/modules/player-memberships";

export interface GetPreviewChargesData {
  teamSeasonId: string;
  paymentPlanId: string;
  startDate: string;
  membershipDiscounts?: {
    registrationDiscountPercent: number;
    recurringDiscountPercent: number;
    seasonFeeDiscountPercent: number;
    startDate: string;
    endDate?: string;
  }[];
  isMigrated: boolean;
}

export const getPreviewCharges = async (
  data: GetPreviewChargesData,
): Promise<ServiceResponse<IPreviewChargesResponse>> => {
  return handleServerAction(async () => {
    const response = await api.post<IPreviewChargesResponse>(
      `membership-charges/preview`,
      data,
    );

    return {
      error: false,
      data: response,
      message: response.message || "Cargos calculados exitosamente",
    };
  });
};
