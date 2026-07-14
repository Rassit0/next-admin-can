"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembershipPause } from "../interfaces/player-membership.interface";

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
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IPlayerMembershipPause;
    }>(`player-memberships/${id}/pauses`, { startDate, endDate, reason });

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
