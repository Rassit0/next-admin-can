"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICharge } from "../interfaces/charges.interface";

export const removeCharge = async (
  id: string,
): Promise<ServiceResponse<ICharge>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: ICharge;
    }>(`charges/${id}`);

    updateTag("charges");
    return {
      error: false,
      data: response.data,
      message: response.message || "Cargo eliminado exitosamente",
    };
  });
};
