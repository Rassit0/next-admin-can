"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import {
  IPlayerMembership,
  IPlayerMembershipReentryInfo,
  IReenterPlayerMembershipDto,
} from "@/modules/player-memberships";

export const getReentryInfoAction = async (
  membershipId: string,
): Promise<ServiceResponse<IPlayerMembershipReentryInfo>> => {
  return handleServerAction(async () => {
    const response = await api.get<{
      data: IPlayerMembershipReentryInfo;
      message: string;
    }>(`player-memberships/re-entry-info/${membershipId}`);

    return {
      error: false,
      data: response.data,
      message: response.message || "Información de reingreso obtenida exitosamente",
    };
  });
};

export const reenterPlayerMembershipAction = async (
  dto: IReenterPlayerMembershipDto,
): Promise<ServiceResponse<IPlayerMembership>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IPlayerMembership;
    }>("player-memberships/re-entry", dto);

    updateTag("player-memberships");
    updateTag("team-season-categories");
    updateTag("reports");

    return {
      error: false,
      data: response.data,
      message: response.message || "Reingreso registrado exitosamente",
    };
  });
};
