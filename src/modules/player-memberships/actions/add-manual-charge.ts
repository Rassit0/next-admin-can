"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

export interface AddManualChargeData {
  membershipId: string;
  description: string;
  amount: number;
  dueDate: string;
}

export const addManualCharge = async (
  data: AddManualChargeData,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: any;
    }>(`membership-charges/manual`, data);

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Cargo extra creado exitosamente",
    };
  });
};
