"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICharge } from "../interfaces/charges.interface";

export interface UpdateChargeData {
  id: string;
  description?: string;
  amount?: number;
  dueDate?: string;
}

export const updateCharge = async (
  data: UpdateChargeData,
): Promise<ServiceResponse<ICharge>> => {
  return handleServerAction(async () => {
    const { id, ...payload } = data;
    const response = await api.patch<{
      message: string;
      data: ICharge;
    }>(`charges/${id}`, payload);

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Cargo actualizado exitosamente",
    };
  });
};
