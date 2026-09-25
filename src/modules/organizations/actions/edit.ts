"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IOrganization } from "../interfaces/organization.interface";
import { handleServerAction } from "@/utils";

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
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IOrganization }>(
      `organizations/${id}`,
      data,
    );

    updateTag("organizations");
    return {
      error: false,
      data: response.data,
      message: response.message || "Organización editada exitosamente",
    };
  });
};
