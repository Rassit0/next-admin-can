"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IShift } from "@/modules/shifts";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const addShift = async (data: {
  name: string;
}): Promise<ServiceResponse<IShift>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente." } as any;
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: IShift }>(
      `shifts`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("shifts");
    return {
      error: false,
      data: response.data,
      message: response.message || "Turno agregado exitosamente",
    };
  });
};

