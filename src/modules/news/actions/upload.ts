"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const uploadNewsImage = async (
  formData: FormData
): Promise<ServiceResponse<{ url: string }>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado." } as any;

  return handleServerAction(async () => {
    // Note: api.post in CANApiAdapter typically converts body to JSON unless it's FormData.
    // The adapter needs to properly send FormData and NOT set Content-Type to application/json.
    // Assuming CANApiAdapter handles FormData correctly like the existing storage upload does.
    const res = await api.post<{ url: string }>(
      "news/upload-image",
      formData,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        }
      }
    );
    return {
      error: false,
      data: res, // Because api.post returns directly T ({url: string})
      message: "Imagen subida exitosamente",
    };
  });
};
