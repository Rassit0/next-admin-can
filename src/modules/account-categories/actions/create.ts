"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountCategory } from "../interfaces/category.interface";
import { updateTag } from "next/cache";

interface CreateAccountCategoryDto {
  name: string;
  description?: string;
  code?: string;
  type: "RECEIVABLE" | "PAYABLE";
}

export const createAccountCategory = async (
  data: CreateAccountCategoryDto,
): Promise<ServiceResponse<IAccountCategory>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: IAccountCategory }>("account-categories", data);

    updateTag("account-categories");

    return {
      error: false,
      data: res.data,
      message: res.message || "Categoría creada exitosamente",
    };
  });
};
