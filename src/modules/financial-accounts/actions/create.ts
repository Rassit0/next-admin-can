"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { FinancialAccount } from "../interfaces/financial-account.interface";
import { handleServerAction } from "@/utils";

export const createFinancialAccount = async (
  data: Partial<FinancialAccount>,
): Promise<ServiceResponse<FinancialAccount>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: FinancialAccount;
    }>(`financial-accounts`, data);

    updateTag("financial-accounts");
    return {
      error: false,
      data: response.data,
      message: response.message || "Cuenta financiera creada exitosamente",
    };
  });
};
