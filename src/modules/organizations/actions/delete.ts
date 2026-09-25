"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IOrganization } from "../interfaces/organization.interface";

export const deleteSchool = async (
  id: string,
): Promise<ServiceResponse<IOrganization>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: IOrganization }>(
      `organizations/${id}`,
    );

    updateTag("organizations");
    return {
      error: false,
      data: response.data,
      message: response.message || "Organización eliminada exitosamente",
    };
  });
};
