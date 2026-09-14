"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const uploadBannerImage = async (
  formData: FormData
): Promise<ServiceResponse<{ url: string }>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    const res = await api.post<{ url: string }>(
      "banners/upload-image",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        }
      }
    );
    return {
      error: false,
      data: res,
      message: "Imagen subida exitosamente",
    };
  });
};
