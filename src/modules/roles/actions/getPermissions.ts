"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { IPlayersResponse } from "@/modules/players";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

interface SearchParams {
  roleId?: string;
}

export const getPermissionsArray = async ({
  roleId,
}: SearchParams): Promise<ServiceResponse<string[]>> => {
  const session = await auth();
  console.log("session desde getCategories:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (roleId) params.set("roleId", roleId);

    const res = await api.get<{ message: string; data: string[] }>(
      `roles/permissions/array?${params.toString()}`,
      {
        next: {
          tags: ["roles", "permissions"],
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Permisos obtenidos exitosamente",
    };
  });
};
