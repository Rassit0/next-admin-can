"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IOrganization } from "../interfaces/organization.interface";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getOrganizationById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IOrganization>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IOrganization }>(
      `organizations/${id}`,
      {
        next: {
          tags: ["organizations"],
          revalidate: 3600,
        },
      },
    );

    console.log(res);

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Organización obtenida exitosamente",
    };
  });
};
