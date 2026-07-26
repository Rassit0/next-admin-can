"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeam } from "@/modules/teams";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const addTeam = async (data: {
  name: string;
  description: string | null;
  clubId: string;
}): Promise<ServiceResponse<ITeam>> => {
  const session = await auth();
  console.log("session desde addTeam:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ITeam }>(
      `teams`,
      data,
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
      message: response.message || "Equipo agregado exitosamente",
    };
  });
};
