"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICategory } from "@/modules/categories";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    name: string;
    description: string | null;
    minAge: number;
    maxAge: number;
    disciplineId: string;
  };
}

export const editCategory = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ICategory>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICategory }>(
      `categories/${id}`,
      data,
    );

    updateTag("categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria editada exitosamente",
    };
  });
};
