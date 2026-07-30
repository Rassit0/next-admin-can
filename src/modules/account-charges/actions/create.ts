"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountCharge } from "../interfaces/charge.interface";
import { revalidateTag, updateTag } from "next/cache";

export interface CreateAccountChargeDto {
  title: string;
  amount: number;
  direction: "RECEIVABLE" | "PAYABLE";
  categoryId: string;
  dueDate: string;
  personId?: string;
  referenceId?: string;
  referenceType?: string;
  description?: string;
  externalEntity?: string;
  referenceNumber?: string;
  immediatePayment?: {
    paymentMethod: string;
    financialAccountId?: string;
  };
}

export const createAccountCharge = async (
  data: CreateAccountChargeDto,
): Promise<ServiceResponse<IAccountCharge>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: IAccountCharge }>(
      "account-charges",
      data,
    );

    updateTag("account-charges");
    updateTag("transactions");

    return {
      error: false,
      data: res.data,
      message: res.message || "Cargo creado exitosamente",
    };
  });
};
