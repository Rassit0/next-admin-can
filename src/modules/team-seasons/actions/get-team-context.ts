"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Team } from "@/modules/team-seasons";
import { auth } from "@/auth";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamContext = async ({
  id,
}: SearchParams): Promise<ServiceResponse<Team>> => {
  const session = await auth();
  console.log("session desde getTeamContext:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: Team }>(
      `team-seasons/team/context/${id}`,
      {
        next: {
          tags: ["teams"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: "Club obtenido exitosamente",
    };
  });
};
