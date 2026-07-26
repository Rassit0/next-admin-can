"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICategoryResponse } from "@/modules/categories";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  clubId?: string;
  callbackUrl?: string;
}

export const getCategories = async ({
  search,
  per_page = "5",
  page = "1",
  clubId,
}: SearchParams): Promise<ServiceResponse<ICategoryResponse>> => {
  const session = await auth();
  console.log("session desde getCategories:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (clubId) params.set("clubId", clubId);

    const res = await api.get<ICategoryResponse>(
      `categories?${params.toString()}`,
      {
        next: {
          tags: ["categories"],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    const data = res.data.map((category) => ({
      ...category,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Categorias obtenidas exitosamente",
    };
  });
};
