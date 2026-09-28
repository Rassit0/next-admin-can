"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface INewsAsset {
  id: string;
  url: string;
}

export const uploadNewsAsset = async (
  uploadSessionId: string,
  formData: FormData,
): Promise<ServiceResponse<INewsAsset>> => {
  return handleServerAction(async () => {
    // Append uploadSessionId to the formData if not already present
    if (!formData.has("uploadSessionId")) {
      formData.append("uploadSessionId", uploadSessionId);
    }

    const response = await api.post<INewsAsset>("news/assets", formData, {
      // Assuming api.post handles FormData correctly if no custom headers are needed,
      // or we let it serialize properly. The NestJS API expects multipart/form-data.
      headers: {
        // Let the browser/fetch set the multipart/form-data boundary
      },
    });

    return {
      error: false,
      data: response,
      message: "Asset subido exitosamente",
    };
  });
};

export const cancelNewsUploadSession = async (
  uploadSessionId: string,
): Promise<ServiceResponse<{ message: string }>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string }>("news/assets/cancel-session", {
      uploadSessionId,
    });

    return {
      error: false,
      data: response,
      message: "Sesión cancelada",
    };
  });
};
