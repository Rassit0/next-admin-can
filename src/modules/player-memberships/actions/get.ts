import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IPlayerMembership,
  IPlayerMembershipResponse,
} from "@/modules/player-memberships";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  teamSeasonId: string;
  status?: string;
  playerId?: string;
  paymentPlanId?: string;
}

const parseMembership = (membership: IPlayerMembership): IPlayerMembership => ({
  ...membership,
  startedAt: membership.startedAt ? new Date(membership.startedAt) : new Date(),
  finishedAt: membership.finishedAt ? new Date(membership.finishedAt) : null,
  createdAt: membership.createdAt ? new Date(membership.createdAt) : new Date(),
  updatedAt: membership.updatedAt ? new Date(membership.updatedAt) : new Date(),
});

export const getPlayerMemberships = async ({
  search,
  per_page = "10",
  page = "1",
  teamSeasonId,
  status,
  playerId,
  paymentPlanId,
}: SearchParams): Promise<ServiceResponse<IPlayerMembershipResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (status) params.set("status", status);
    if (playerId) params.set("playerId", playerId);
    if (paymentPlanId) params.set("paymentPlanId", paymentPlanId);
    params.set("teamSeasonId", teamSeasonId);

    const res = await api.get<IPlayerMembershipResponse>(
      `player-memberships?${params.toString()}`,
      {
        next: {
          tags: ["player-memberships"],
          revalidate: 3600,
        },
      },
    );

    const data = (res.data ?? []).map(parseMembership);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Membresías obtenidas exitosamente",
    };
  });
};
