"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const deleteShift = async (
  id: string,
): Promise<ServiceResponse<void>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente." } as any;
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: any }>(
      `shifts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );
    updateTag("shifts");
    return {
      error: false,
      data: undefined,
      message: response.message || "Turno eliminado exitosamente",
    };
  });
};

