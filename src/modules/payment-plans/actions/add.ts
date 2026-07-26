"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPaymentPlan } from "@/modules/payment-plans";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

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
  const session = await auth();
  console.log("session desde addPaymentPlan:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: IPaymentPlan }>(
      `payment-plans`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("payment-plans");
    return {
      error: false,
      data: response.data,
      message: response.message || "Plan de pago agregado exitosamente",
    };
  });
};
