"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPreviewChargesResponse } from "@/modules/player-memberships";
import { auth } from "@/auth";

export interface GetPreviewChargesData {
  teamSeasonId: string;
  paymentPlanId: string;
  startDate: string;
  membershipDiscounts?: {
    registrationDiscountPercent: number;
    recurringDiscountPercent: number;
    startDate: string;
    endDate?: string;
  }[];
  isMigrated: boolean;
}

export const getPreviewCharges = async (
  data: GetPreviewChargesData,
): Promise<ServiceResponse<IPreviewChargesResponse>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<IPreviewChargesResponse>(
      `membership-charges/preview`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: response,
      message: response.message || "Cargos calculados exitosamente",
    };
  });
};
