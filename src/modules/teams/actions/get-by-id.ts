"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITeam } from "../interfaces/team.interface";
import { auth } from "@/auth";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ITeam>> => {
  const session = await auth();
  console.log("session desde getTeamById:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeam }>(`teams/${id}`, {
      next: {
        tags: ["teams"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Equipo obtenido exitosamente",
    };
  });
};
