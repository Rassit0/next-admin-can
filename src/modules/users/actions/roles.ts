"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface IRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  isSuperAdmin: boolean;
}

export interface IRolesResponse {
  data: IRole[];
  meta: any;
}

export const getRoles = async (
  searchParams?: Record<string, string>,
): Promise<ServiceResponse<IRolesResponse>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
    }

    const res = await api.get<IRolesResponse>(`roles?${params.toString()}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
      next: { tags: ["roles"] },
    });
    return { error: false, data: res, message: "Roles obtenidos" };
  });
};

export const createRole = async (
  data: { name: string; description: string; permissionIds: string[] },
): Promise<ServiceResponse<IRole>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.post<IRole>("roles", data, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Rol creado" };
  });
};

export const updateRole = async (
  id: string,
  data: { name: string; description: string; permissionIds?: string[] },
): Promise<ServiceResponse<IRole>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.patch<IRole>(`roles/${id}`, data, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Rol actualizado" };
  });
};

export const deleteRole = async (id: string): Promise<ServiceResponse<IRole>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.delete<IRole>(`roles/${id}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Rol eliminado" };
  });
};

export const getPermissions = async (
  searchParams?: Record<string, string>,
): Promise<ServiceResponse<any>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
    }

    const res = await api.get<any>(`roles/permissions?${params.toString()}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
      next: { tags: ["permissions"] },
    });
    return { error: false, data: res, message: "Permisos obtenidos" };
  });
};
