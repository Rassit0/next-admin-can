// modules/player-passes/queries/get-club-options-by-discipline.ts

import { api } from "@/utils/api";
import { ITeamsByClubOptionsResponse } from "@/modules/players-passes";

export async function getTeamOptionsByClub(
  clubId: string,
): Promise<ITeamsByClubOptionsResponse> {
  return await api.get<ITeamsByClubOptionsResponse>(
    `player-passes/teams/options/${clubId}`,
  );
}
