"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { FinancialAccount } from "../interfaces/financial-account.interface";
import { handleServerAction } from "@/utils";

export const getFinancialAccounts = async (): Promise<ServiceResponse<FinancialAccount[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ data: FinancialAccount[], message?: string }>(
      `financial-accounts`,
      {
        next: {
          tags: ["financial-accounts"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Cuentas financieras obtenidas exitosamente",
    };
  });
};
