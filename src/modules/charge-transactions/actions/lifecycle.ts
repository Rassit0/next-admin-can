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
  finish: "Membresía finalizada exitosamente",
  suspend: "Membresía suspendida exitosamente",
  withdraw: "Atleta dado de baja exitosamente",
  reactivate: "Membresía reactivada exitosamente",
  activate: "Membresía activada exitosamente",
};

export const updateMembershipLifecycle = async ({
  id,
  action,
}: {
  id: string;
  action: MembershipLifecycleAction;
}): Promise<ServiceResponse<IPlayerMembership>> => {
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
    }>(
      `player-memberships/${action}/${id}`,
      {},
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
      message: response.message || messages[action],
    };
  });
};
