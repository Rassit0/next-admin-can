"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICategory } from "@/modules/categories";

export const deleteCategory = async (
  id: string,
): Promise<ServiceResponse<ICategory>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ICategory }>(
      `categories/${id}`,
    );

    updateTag("categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria eliminada exitosamente",
    };
  });
};
