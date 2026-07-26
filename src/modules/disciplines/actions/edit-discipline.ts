"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { auth } from "@/auth";
import { handleServerAction } from "@/utils";

interface Props {
  id: number;
  data: {
    name: string;
    icon: string;
  };
}

export const editDiscipline = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IDiscipline>> => {
  const session = await auth();
  console.log("session desde editDiscipline:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IDiscipline }>(
      `disciplines/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("disciplines");
    return {
      error: false,
      data: response.data,
      message: response.message || "Disciplina editada exitosamente",
    };
  });
};
