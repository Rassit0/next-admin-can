"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface FinancialAccountOption {
  id: string;
  name: string;
  currency: string;
  type: string;
  isDefault: boolean;
  allowedPaymentMethods: string[];
}

export const getFinancialAccountOptions = async (): Promise<ServiceResponse<FinancialAccountOption[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ data: FinancialAccountOption[], message?: string }>(
      `financial-accounts/options`,
      {
        next: {
          tags: ["financial-accounts", "transactions"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Opciones de cuentas financieras obtenidas exitosamente",
    };
  });
};
