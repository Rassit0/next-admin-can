"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICategory } from "@/modules/categories";
import { handleServerAction } from "@/utils";

export const addCategory = async (data: {
  name: string;
  minAge: number;
  maxAge: number;
  disciplineId: string;
}): Promise<ServiceResponse<ICategory>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ICategory }>(
      `categories`,
      data,
    );

    updateTag("categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria agregada exitosamente",
    };
  });
};
