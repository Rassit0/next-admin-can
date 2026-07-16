import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonSummaryResponse } from "@/modules/team-seasons";

interface SearchParams {
  id: string;
}

export const getTeamSeasonSummary = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ISeasonSummaryResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<ISeasonSummaryResponse>(
      `team-seasons/${id}/summary`,
      {
        next: {
          tags: [
            "team-seasons",
            `team-season-summary-${id}`,
            "player-memberships",
            "payments",
            "charges",
          ],
          revalidate: 60,
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Resumen obtenido exitosamente",
    };
  });
};
