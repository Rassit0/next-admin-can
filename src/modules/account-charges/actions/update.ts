"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountCharge } from "../interfaces/charge.interface";
import { updateTag } from "next/cache";

export interface UpdateAccountChargeDto {
  title?: string;
  description?: string;
  dueDate?: string;
  categoryId?: string;
  externalEntity?: string;
  referenceNumber?: string;
  personId?: string;
}

export const updateAccountCharge = async (
  id: string,
  data: UpdateAccountChargeDto,
): Promise<ServiceResponse<IAccountCharge>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: IAccountCharge }>(`account-charges/${id}`, data);

    updateTag("account-charges");
    updateTag(`account-charges-${id}`);
    updateTag("account-charges-summary");

    return {
      error: false,
      data: res.data,
      message: res.message || "Cargo actualizado exitosamente",
    };
  });
};
