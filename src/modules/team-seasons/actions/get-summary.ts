"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonSummaryResponse } from "@/modules/team-seasons";
import { auth } from "@/auth";

interface SearchParams {
  id: string;
}

export const getTeamSeasonSummary = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ISeasonSummaryResponse>> => {
  const session = await auth();
  console.log("session desde getTeamSeasonSummary:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

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
        headers: {
          Authorization: `Bearer ${session.user.token}`,
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
