"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICategory } from "@/modules/categories";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getCategoryById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ICategory>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ICategory }>(
      `categories/${id}`,
      {
        next: {
          tags: ["categories"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Categoria obtenida exitosamente",
    };
  });
};
