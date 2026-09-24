"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface ISelfProfile {
  user: {
    email: string;
    role?: string;
  };
  person: {
    id: string;
    name: string;
    lastName: string;
    secondLastName?: string | null;
    documentType?: string | null;
    documentNumber?: string | null;
    phone?: string | null;
    address?: string | null;
    imageUrl: string | null;
  } | null;
}

export const getDetailedProfile = async (): Promise<ServiceResponse<ISelfProfile>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado" };

  return handleServerAction(async () => {
    const res = await api.get<{ data: ISelfProfile; message?: string }>("users/me/detailed-profile", {
      headers: { Authorization: `Bearer ${session.user.token}` },
      // request-scoped, we do NOT use next: { tags: ... } because it shouldn't be persistently cached across users
      cache: "no-store", 
    });
    
    // Some endpoints wrap in data
    const profile = res.data ?? (res as unknown as ISelfProfile);
    
    return { error: false, data: profile, message: res.message || "Perfil detallado obtenido" };
  });
};
