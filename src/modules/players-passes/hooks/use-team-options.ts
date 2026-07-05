// modules/player-passes/hooks/use-club-options.ts

import { useQuery } from "@tanstack/react-query";
import { getTeamOptionsByClub } from "../queries/get-team-options-by-club";

export function useTeamOptions(clubId?: string) {
  return useQuery({
    queryKey: ["team-options", clubId],

    queryFn: () => getTeamOptionsByClub(clubId!),

    enabled: !!clubId,

    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
