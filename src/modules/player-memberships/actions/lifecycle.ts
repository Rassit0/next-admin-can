"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";
import { auth } from "@/auth";

export type MembershipLifecycleAction =
  | "finish"
  | "suspend"
  | "withdraw"
  | "reactivate"
  | "activate";

const messages: Record<MembershipLifecycleAction, string> = {
  finish: "Membresi­a finalizada exitosamente",
  suspend: "Membresi­a suspendida exitosamente",
  withdraw: "Atleta dado de baja exitosamente",
  reactivate: "Membresi­a reactivada exitosamente",
  activate: "Membresi­a activada exitosamente",
};

export const updateMembershipLifecycle = async ({
  id,
  action,
  reason,
}: {
  id: string;
  action: MembershipLifecycleAction;
  reason?: string;
}): Promise<ServiceResponse<IPlayerMembership>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IPlayerMembership;
    }>(`player-memberships/${action}/${id}`, reason ? { reason } : {});

    updateTag("player-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || messages[action],
    };
  });
};
