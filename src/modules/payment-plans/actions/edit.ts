"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPaymentPlan } from "@/modules/payment-plans";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface Props {
  id: string;
  data: {
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
  };
}

export const editPaymentPlan = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IPaymentPlan>> => {
  const session = await auth();
  console.log("session desde editPaymentPlan:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IPaymentPlan }>(
      `payment-plans/${id}`,
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
      message: response.message || "Plan de pago editado exitosamente",
    };
  });
};
