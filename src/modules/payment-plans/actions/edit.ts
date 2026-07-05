"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPaymentPlan } from "@/modules/payment-plans";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    teamSeasonId: string;
    name: string;
    registrationDiscountPercent: string;
    monthlyDiscountPercent: string;
  };
}

export const editPaymentPlan = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IPaymentPlan>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IPaymentPlan }>(
      `payment-plans/${id}`,
      data,
    );

    updateTag("payment-plans");
    return {
      error: false,
      data: response.data,
      message: response.message || "Plan de pago editado exitosamente",
    };
  });
};
