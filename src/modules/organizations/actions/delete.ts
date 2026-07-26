"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IOrganization } from "../interfaces/organization.interface";
import { auth } from "@/auth";

export const deleteSchool = async (
  id: string,
): Promise<ServiceResponse<IOrganization>> => {
  const session = await auth();
  console.log("session desde getCategories:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: IOrganization }>(
      `organizations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    updateTag("organizations");
    return {
      error: false,
      data: response.data,
      message: response.message || "Organización eliminada exitosamente",
    };
  });
};
