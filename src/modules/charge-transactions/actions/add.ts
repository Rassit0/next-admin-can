"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";
import { auth } from "@/auth";

export interface AddPlayerMembershipData {
  playerId: string;
  teamSeasonId: string;
  paymentPlanId: string;
  startedAt: string;
  isMigrated: boolean;
  membershipDiscounts?: {
    registrationDiscountPercent: number;
    recurringDiscountPercent: number;
    startDate: string;
    endDate?: string;
    type: string;
    reason?: string;
  }[];
}

export const addPlayerMembership = async (
  data: AddPlayerMembershipData,
): Promise<ServiceResponse<IPlayerMembership>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IPlayerMembership;
    }>(`player-memberships`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("player-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Atleta inscrito exitosamente",
    };
  });
};
