"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { auth } from "@/auth";
import { handleServerAction } from "@/utils";

interface Props {
  data: {
    name: string;
    icon: string;
  };
}

export const addDiscipline = async ({
  data,
}: Props): Promise<ServiceResponse<IDiscipline>> => {
  const session = await auth();
  console.log("session desde addDiscipline:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: IDiscipline }>(
      `disciplines`,
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
      data: res.data,
      message: res.message || "Disciplina agregada exitosamente",
    };
  });
};
