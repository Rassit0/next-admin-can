"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

interface SearchParams {
  roleId?: string;
  skip401Redirect?: boolean;
}

export const getPermissionsArray = async ({
  roleId,
  skip401Redirect = false,
}: SearchParams): Promise<ServiceResponse<string[]>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (roleId) params.set("roleId", roleId);

    const res = await api.get<{ message: string; data: string[] }>(
      `roles/permissions/array?${params.toString()}`,
      {
        next: {
          tags: ["roles", "permissions"],
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Permisos obtenidos exitosamente",
    };
  }, undefined, skip401Redirect);
};
