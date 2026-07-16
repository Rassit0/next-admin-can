"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";

export const removeMembership = async (
  id: string,
): Promise<ServiceResponse<IPlayerMembership>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: IPlayerMembership;
    }>(`player-memberships/${id}`);

    updateTag("player-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Membresía eliminada exitosamente",
    };
  });
};
