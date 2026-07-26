"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IOrganization } from "../interfaces/organization.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface Props {
  id: string;
  data: {
    name: string;
    imageUrl?: string;
    address: string;
  };
}

export const editOrganization = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IOrganization>> => {
  const session = await auth();
  console.log("session desde getCategories:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IOrganization }>(
      `organizations/${id}`,
      data,
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
      message: response.message || "Organización editada exitosamente",
    };
  });
};
