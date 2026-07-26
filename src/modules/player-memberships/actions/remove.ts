"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";
import { auth } from "@/auth";

export const removeMembership = async (
  id: string,
): Promise<ServiceResponse<IPlayerMembership>> => {
  const session = await auth();
  console.log("session desde removeMembership:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: IPlayerMembership;
    }>(`player-memberships/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("player-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Membresía eliminada exitosamente",
    };
  });
};
