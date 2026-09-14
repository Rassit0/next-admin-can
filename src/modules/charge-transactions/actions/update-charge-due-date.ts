"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICharge } from "../interfaces/charges.interface";
import { auth } from "@/auth";

export interface UpdateDueDateData {
  id: string;
  dueDate: string;
}

export const updateChargeDueDate = async (
  data: UpdateDueDateData,
): Promise<ServiceResponse<ICharge>> => {
  const session = await auth();
  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const { id, dueDate } = data;
    const response = await api.patch<{
      message: string;
      data: ICharge;
    }>(`charges/${id}/due-date`, { dueDate }, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Fecha de vencimiento actualizada exitosamente",
    };
  });
};
