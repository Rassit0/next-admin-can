"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export interface IMatchCallUpPlayer {
  playerId: string;
  isGuest?: boolean;
}

export interface IMatchCallUpCandidate {
  playerId: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
}

export interface IMatchCallUpsResponse {
  matchId: string;
  home: { playerId: string; isGuest: boolean; player: { person: { name: string; lastName: string; imageUrl: string | null } } }[];
  away: { playerId: string; isGuest: boolean; player: { person: { name: string; lastName: string; imageUrl: string | null } } }[];
  homeConfiguredAt: string | null;
  awayConfiguredAt: string | null;
}

export interface IMatchCallUpCandidatesResponse {
  home: IMatchCallUpCandidate[];
  away: IMatchCallUpCandidate[];
}

export const getMatchCallUps = async (
  matchId: string
): Promise<ServiceResponse<IMatchCallUpsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<IMatchCallUpsResponse>(
      `matches/${matchId}/call-ups`
    );

    return {
      error: false,
      data: res,
      message: "Convocatoria obtenida",
    };
  });
};

export const getMatchCallUpCandidates = async (
  matchId: string
): Promise<ServiceResponse<IMatchCallUpCandidatesResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<IMatchCallUpCandidatesResponse>(
      `matches/${matchId}/call-ups/candidates`
    );

    return {
      error: false,
      data: res,
      message: "Candidatos obtenidos",
    };
  });
};

export const updateMatchCallUpSide = async (
  matchId: string,
  side: "HOME" | "AWAY",
  players: IMatchCallUpPlayer[]
): Promise<ServiceResponse<IMatchCallUpsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.put<IMatchCallUpsResponse>(
      `matches/${matchId}/call-ups/${side}`,
      { players }
    );

    // Update the calendar tag if needed, although user asked not to revalidate everything unnecessarily.
    // The calendar doesn't show call-ups right now, but let's update it in case it does in the future.
    try {
      await updateTag("calendar");
    } catch {}

    return {
      error: false,
      data: res,
      message: "Convocatoria actualizada",
    };
  });
};
