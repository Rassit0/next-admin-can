"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeam } from "../interfaces/team.interface";
import { auth } from "@/auth";

export const deleteTeam = async (
  id: string,
): Promise<ServiceResponse<ITeam>> => {
  const session = await auth();
  console.log("session desde deleteTeam:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ITeam }>(
      `teams/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("teams");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo eliminado exitosamente",
    };
  });
};
