"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembershipPause } from "../interfaces/player-membership.interface";
import { auth } from "@/auth";

export const createMembershipPause = async ({
  id,
  startDate,
  endDate,
  reason,
}: {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<ServiceResponse<IPlayerMembershipPause>> => {
  const session = await auth();
  console.log("session desde createMembershipPause:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IPlayerMembershipPause;
    }>(
      `player-memberships/${id}/pauses`,
      { startDate, endDate, reason },
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("player-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Pausa creada exitosamente",
    };
  });
};

export const getMembershipPauses = async (
  id: string,
): Promise<ServiceResponse<IPlayerMembershipPause[]>> => {
  return handleServerAction(async () => {
    const response = await api.get<{
      message: string;
      data: IPlayerMembershipPause[];
    }>(`player-memberships/${id}/pauses`);

    return {
      error: false,
      data: response.data,
      message: response.message,
    };
  });
};
