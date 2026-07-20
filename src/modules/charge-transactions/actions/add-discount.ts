"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICharge } from "../interfaces/charges.interface";

export interface AddDiscountData {
  id: string;
  discountAmount: number;
  discountReason?: string;
}

export const addChargeDiscount = async (
  data: AddDiscountData,
): Promise<ServiceResponse<ICharge>> => {
  return handleServerAction(async () => {
    const { id, ...payload } = data;
    const response = await api.patch<{
      message: string;
      data: ICharge;
    }>(`charges/${id}/discount`, payload);

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Descuento aplicado exitosamente",
    };
  });
};
