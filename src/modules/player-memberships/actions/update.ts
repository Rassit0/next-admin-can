"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";

export interface UpdatePlayerMembershipData {
  startedAt?: string;
  // Añadir otros campos si es necesario
}

export const updatePlayerMembership = async (
  id: string,
  data: UpdatePlayerMembershipData,
): Promise<ServiceResponse<IPlayerMembership>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{
      message: string;
      data: IPlayerMembership;
    }>(`player-memberships/${id}`, data);

    updateTag("player-memberships");
    updateTag(`player-membership-${id}`);
    return {
      error: false,
      data: response.data,
      message: response.message || "Membresía actualizada exitosamente",
    };
  });
};
