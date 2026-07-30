"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const cancelAccountCharge = async (
  id: string,
): Promise<ServiceResponse<void>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: void }>(`account-charges/${id}`);

    updateTag("account-charges");
    updateTag(`account-charges-${id}`);
    updateTag("account-charges-summary");

    return {
      error: false,
      data: res.data,
      message: res.message || "Cargo cancelado exitosamente",
    };
  });
};
