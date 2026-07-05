// modules/player-passes/queries/get-club-options-by-discipline.ts

import { api } from "@/utils/api";
import { IClubOptionsByDisciplineResponse } from "@/modules/players-passes";

export async function getClubOptionsByDiscipline(
  disciplineId: string,
): Promise<IClubOptionsByDisciplineResponse> {
  return await api.get<IClubOptionsByDisciplineResponse>(
    `player-passes/clubs/options/${disciplineId}`,
  );
}
