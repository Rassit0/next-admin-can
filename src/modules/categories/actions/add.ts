"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICategory } from "@/modules/categories";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const addCategory = async (data: {
  name: string;
  minAge: number;
  maxAge?: number;
  disciplineId: string;
}): Promise<ServiceResponse<ICategory>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ICategory }>(
      `categories`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria agregada exitosamente",
    };
  });
};
