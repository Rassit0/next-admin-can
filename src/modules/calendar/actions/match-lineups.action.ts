"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export interface IMatchLineupEntry {
  callUpId: string;
  isStarter: boolean;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface IMatchCallUpWithLineup {
  id: string;
  side: "HOME" | "AWAY";
  isGuest: boolean;
  player: {
    id: string;
    person: {
      name: string;
      lastName: string;
    };
  };
  lineup: {
    id: string;
    callUpId: string;
    isStarter: boolean;
    minutesPlayed: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  } | null;
}

export interface IMatchLineupsResponse {
  home: IMatchCallUpWithLineup[];
  away: IMatchCallUpWithLineup[];
}

export async function getMatchLineup(matchId: string) {
  try {
    const res = await api.get<IMatchLineupsResponse>(`/matches/${matchId}/lineup`, {
      next: { tags: ["calendar", `match-lineup-${matchId}`] },
    });
    
    return res;
  } catch (error) {
    console.error("getMatchLineup error:", error);
    return null;
  }
}

export async function updateMatchLineupSide(
  matchId: string,
  side: "HOME" | "AWAY",
  lineups: IMatchLineupEntry[]
) {
  return handleServerAction(async () => {
    const res = await api.put<{ message: string, data: Partial<IMatchLineupsResponse> }>(
      `/matches/${matchId}/lineup/${side}`,
      { lineups }
    );
    
    updateTag("calendar");
    
    return { 
      error: false,
      data: res.data,
      message: res.message || "Planilla actualizada exitosamente"
    };
  });
}
