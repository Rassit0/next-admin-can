"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

export interface AddMassiveManualChargeData {
  courseSeasonId: string;
  description: string;
  amount: number;
  dueDate: string;
}

export const addMassiveManualCharge = async (
  data: AddMassiveManualChargeData,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: any;
    }>(`membership-charges/massive-manual`, data);

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Cargos masivos generados exitosamente",
    };
  });
};
