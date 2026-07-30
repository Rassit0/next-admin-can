"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const deleteAccountCategory = async (
  id: string,
): Promise<ServiceResponse<void>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: void }>(`account-categories/${id}`);

    updateTag("account-categories");

    return {
      error: false,
      data: res.data,
      message: res.message || "Categoría eliminada exitosamente",
    };
  });
};
