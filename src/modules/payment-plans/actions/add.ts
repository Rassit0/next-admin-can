"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPaymentPlan } from "@/modules/payment-plans";
import { handleServerAction } from "@/utils";

export const addPaymentPlan = async (data: {
  teamSeasonId?: string;
  courseSeasonId?: string;
  name: string;
  registrationDiscountPercent: string;
  recurringDiscountPercent: string;
  seasonFeeDiscountPercent: string;
  isSinglePayment: boolean;
  advanceCycles?: number;
  advanceCyclesDiscountPercent?: string;
  isDefault: boolean;
}): Promise<ServiceResponse<IPaymentPlan>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: IPaymentPlan }>(
      `payment-plans`,
      data,
    );

    updateTag("payment-plans");
    return {
      error: false,
      data: response.data,
      message: response.message || "Plan de pago agregado exitosamente",
    };
  });
};
