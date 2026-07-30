"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountCategory } from "../interfaces/category.interface";
import { updateTag } from "next/cache";

interface UpdateAccountCategoryDto {
  name?: string;
  description?: string;
  type?: "RECEIVABLE" | "PAYABLE";
}

export const updateAccountCategory = async (
  id: string,
  data: UpdateAccountCategoryDto,
): Promise<ServiceResponse<IAccountCategory>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: IAccountCategory }>(`account-categories/${id}`, data);

    updateTag("account-categories");


    return {
      error: false,
      data: res.data,
      message: res.message || "Categoría actualizada exitosamente",
    };
  });
};
