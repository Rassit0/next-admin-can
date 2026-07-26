"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICategory } from "@/modules/categories";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface Props {
  id: string;
  data: {
    name: string;
    description: string | null;
    minAge: number;
    maxAge?: number | null;
    disciplineId: string;
  };
}

export const editCategory = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ICategory>> => {
  const session = await auth();
  console.log("session desde editCategory:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICategory }>(
      `categories/${id}`,
      data,
      { headers: { Authorization: `Bearer ${session.user.token}` } },
    );

    updateTag("categories");
    return {
      error: false,
      data: response.data,
      message: response.message || "Categoria editada exitosamente",
    };
  });
};
