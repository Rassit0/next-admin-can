"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPlayerMembership } from "@/modules/player-memberships";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getPlayerMembershipById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IPlayerMembership>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IPlayerMembership }>(
      `player-memberships/${id}`,
      {
        next: {
          tags: ["player-memberships", "charges"],
          revalidate: 3600,
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
