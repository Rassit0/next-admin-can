"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeam } from "@/modules/teams";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface Props {
  id: string;
  data: {
    name: string;
    description: string | null;
    clubId: string;
  };
}

export const editTeam = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ITeam>> => {
  const session = await auth();
  console.log("session desde editTeam:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeam }>(
      `teams/${id}`,
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
      message: response.message || "Equipo editado exitosamente",
    };
  });
};
