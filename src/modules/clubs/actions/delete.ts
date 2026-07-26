"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IClub } from "../interfaces/club.interface";
import { auth } from "@/auth";

export const deleteClub = async (
  id: string,
): Promise<ServiceResponse<IClub>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: IClub }>(
      `clubs/${id}`,
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
      message: response.message || "Club eliminado exitosamente",
    };
  });
};
