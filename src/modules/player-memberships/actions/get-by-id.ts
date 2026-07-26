"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";
import { auth } from "@/auth";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getPlayerMembershipById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IPlayerMembership>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IPlayerMembership }>(
      `player-memberships/${id}`,
      {
        next: {
          tags: ["player-memberships", "charges"],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Membresía de jugador obtenida exitosamente",
    };
  });
};
