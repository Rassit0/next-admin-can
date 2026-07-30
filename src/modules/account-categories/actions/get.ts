"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IAccountCategoriesResponse,
  IAccountCategory,
} from "../interfaces/category.interface";
import { auth } from "@/auth";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  type?: string;
}

const parseCategory = (category: IAccountCategory): IAccountCategory => ({
  ...category,
  createdAt: category.createdAt ? new Date(category.createdAt) : new Date(),
  updatedAt: category.updatedAt ? new Date(category.updatedAt) : new Date(),
});

export const getAccountCategories = async ({
  search,
  per_page = "10",
  page = "1",
  type,
}: SearchParams): Promise<ServiceResponse<IAccountCategoriesResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (type) params.set("type", type);

    const res = await api.get<IAccountCategoriesResponse>(
      `account-categories?${params.toString()}`,
      {
        next: {
          tags: ["account-categories"],
          revalidate: 3600,
        },
      },
    );

    const data = (res.data ?? []).map(parseCategory);

    return {
      error: false,
      data: { ...res, data } as IAccountCategoriesResponse,
      message: res.message || "Categorías obtenidas exitosamente",
    };
  });
};
