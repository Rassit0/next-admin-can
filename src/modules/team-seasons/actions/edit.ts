"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPostTeamSeason, ITeamSeason } from "@/modules/team-seasons";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface Props {
  id: string;
  data: IPostTeamSeason;
}

export const editTeamSeason = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ITeamSeason>> => {
  const session = await auth();
  console.log("session desde editTeamSeason:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("team-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada editada exitosamente",
    };
  });
};
