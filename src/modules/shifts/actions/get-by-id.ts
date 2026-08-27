"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IShift } from "@/modules/shifts";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const getShiftById = async (
  id: string,
): Promise<ServiceResponse<IShift>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente." } as any;

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IShift }>(
      `shifts/${id}`,
      {
        next: {
          tags: [`shift-${id}`],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Turno obtenido exitosamente",
    };
  });
};
