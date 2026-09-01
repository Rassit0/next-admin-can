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

export interface IPerson {
  id: string;
  name: string;
  lastName: string;
  phone: string | null;
  email: string | null;
}

export interface IUser {
  id: string;
  email: string;
  isActive: boolean;
  personId: string | null;
  roleId: string | null;
  createdAt: string;
  updatedAt: string;
  role: IRole | null;
  person: IPerson | null;
  tempPassword?: string; // Solo en creación
}

export interface IUsersResponse {
  data: IUser[];
  meta: any;
}

export const getUsers = async (
  searchParams: Record<string, string>,
): Promise<ServiceResponse<IUsersResponse>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });

    const res = await api.get<IUsersResponse>(`users?${params.toString()}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
      next: { tags: ["users"] },
    });
    return { error: false, data: res, message: "Usuarios obtenidos" };
  });
};

export const getUserById = async (id: string): Promise<ServiceResponse<IUser>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.get<IUser>(`users/${id}`, {
      headers: { Authorization: `Bearer ${session.user.token}` },
      next: { tags: ["users", `user-${id}`] },
    });
    return { error: false, data: res, message: "Usuario obtenido" };
  });
};

export const createUser = async (
  data: { email: string; personId?: string; roleId: string },
): Promise<ServiceResponse<IUser>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.post<IUser>("users", data, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Usuario creado exitosamente" };
  });
};

export const updateUser = async (
  id: string,
  data: { email?: string; personId?: string | null; roleId?: string },
): Promise<ServiceResponse<IUser>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.patch<IUser>(`users/${id}`, data, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Usuario actualizado" };
  });
};

export const deactivateUser = async (id: string): Promise<ServiceResponse<IUser>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.patch<IUser>(`users/${id}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Usuario desactivado" };
  });
};

export const reactivateUser = async (id: string): Promise<ServiceResponse<IUser>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.patch<IUser>(`users/${id}/reactivate`, {}, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    return { error: false, data: res, message: "Usuario reactivado" };
  });
};
