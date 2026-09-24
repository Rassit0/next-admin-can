"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const updatePersonAvatar = async (personId: string, formData: FormData): Promise<ServiceResponse<{ imageUrl: string }>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.patch<{ data: { imageUrl: string }; message?: string }>(`persons/${personId}/avatar`, formData, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    
    const result = res.data ?? (res as unknown as { imageUrl: string });
    
    return { error: false, data: result, message: res.message || "Avatar actualizado exitosamente" };
  });
};
