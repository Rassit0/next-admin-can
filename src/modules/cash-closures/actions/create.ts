"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { CashClosure, CreateCashClosureDto } from "../interfaces/cash-closure.interface";
import { updateTag } from "next/cache";

export const createCashClosure = async (
  data: CreateCashClosureDto,
): Promise<ServiceResponse<CashClosure>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: CashClosure }>(
      "cash-closures",
      data,
    );

    updateTag(`financial-accounts-${data.financialAccountId}-closures`);

    return {
      error: false,
      data: res.data,
      message: res.message || "Cierre de caja registrado exitosamente",
    };
  });
};
