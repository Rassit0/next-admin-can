"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPreviewChargesResponse } from "@/modules/student-memberships";

export interface GetPreviewChargesData {
  courseSeasonId: string;
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
  chargeRegistrationOnMigration?: boolean;
  chargeCurrentMonthOnMigration?: boolean;
  forceFullCycleFee?: boolean;
}

export const getPreviewCharges = async (
  data: GetPreviewChargesData,
): Promise<ServiceResponse<IPreviewChargesResponse>> => {
  return handleServerAction(async () => {
    console.log({ data });
    const response = await api.post<IPreviewChargesResponse>(
      `student-charges/preview`,
      data,
    );

    return {
      error: false,
      data: response,
      message: response.message || "Cargos calculados exitosamente",
    };
  });
};
