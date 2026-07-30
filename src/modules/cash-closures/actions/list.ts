"use server";
import { api } from "@/utils/api";
import { PaginatedResponse, ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { CashClosure } from "../interfaces/cash-closure.interface";

export const getCashClosuresByAccount = async (
  accountId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ServiceResponse<PaginatedResponse<CashClosure>>> => {
  return handleServerAction(async () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await api.get<{
      message: string;
      data: PaginatedResponse<CashClosure>;
    }>(
      `cash-closures/account/${accountId}?${queryParams.toString()}`,
      {
        next: {
          tags: [`financial-accounts-${accountId}-closures`],
        },
      }
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Historial de cierres obtenido exitosamente",
    };
  });
};
