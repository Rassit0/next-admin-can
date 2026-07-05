// modules/player-passes/hooks/use-club-options.ts

import { useQuery } from "@tanstack/react-query";
import { getClubOptionsByDiscipline } from "../queries/get-club-options-by-discipline";

export function useClubOptions(disciplineId?: string) {
  return useQuery({
    queryKey: ["club-options", disciplineId],

    queryFn: () => getClubOptionsByDiscipline(disciplineId!),

    enabled: !!disciplineId,

    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
