"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountCharge } from "../interfaces/charge.interface";

export const getAccountChargeById = async (
  id: string,
): Promise<ServiceResponse<IAccountCharge>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message?: string; data: IAccountCharge }>(
      `account-charges/${id}`,
      {
        next: {
          tags: ["account-charges", `account-charges-${id}`],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Cargo obtenido exitosamente",
    };
  });
};
