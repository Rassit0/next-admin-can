"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICategory } from "@/modules/categories";
import { auth } from "@/auth";

export const deleteCategory = async (
  id: string,
): Promise<ServiceResponse<ICategory>> => {
  const session = await auth();
  console.log("session desde deleteCategory:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ICategory }>(
      `categories/${id}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } },
    );

    updateTag("categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria eliminada exitosamente",
    };
  });
};
