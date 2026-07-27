"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<{
    data: { id: string; name: string; icon: string }[];
    message: string;
  }>
> => {
  return handleServerAction(async () => {
    const res = await api.get<{
      message: string;
      data: { id: string; name: string; icon: string }[];
    }>(`team-seasons/disciplines/options`);

    return {
      error: false,
      data: res,
      message: res.message || "Disciplinas obtenidas exitosamente",
    };
  });
};
