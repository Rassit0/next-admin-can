"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IClub } from "../interfaces/club.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface Props {
  id: string;
  data: {
    name: string;
    disciplineId: string;
  };
}

export const editClub = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IClub>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IClub }>(
      `clubs/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("clubs");
    return {
      error: false,
      data: response.data,
      message: response.message || "Club editado exitosamente",
    };
  });
};
