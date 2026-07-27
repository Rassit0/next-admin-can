"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IOrganization } from "../interfaces/organization.interface";
import { handleServerAction } from "@/utils";

export const addOrganization = async (data: {
  name: string;
  imageUrl?: string;
  address: string;
  email?: string;
  phone?: string;
  disciplineIds?: number[];
}): Promise<ServiceResponse<IOrganization>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: IOrganization }>(
      `organizations`,
      data,
    );

    updateTag("organizations");
    return {
      error: false,
      data: response.data,
      message: response.message || "Organización agregada exitosamente",
    };
  });
};
