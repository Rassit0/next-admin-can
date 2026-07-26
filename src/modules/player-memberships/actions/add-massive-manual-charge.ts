"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface AddMassiveManualChargeData {
  teamSeasonId: string;
  description: string;
  amount: number;
  dueDate: string;
}

export const addMassiveManualCharge = async (
  data: AddMassiveManualChargeData,
): Promise<ServiceResponse<any>> => {
  const session = await auth();
  console.log("session desde getCategories:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: any;
    }>(`membership-charges/massive-manual`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Cargos masivos generados exitosamente",
    };
  });
};
