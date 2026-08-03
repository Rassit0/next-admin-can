"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { UploadedAttachment } from "@/hooks/useStorage";

export const uploadAttachments = async (
  formData: FormData
): Promise<ServiceResponse<UploadedAttachment[]>> => {
  return handleServerAction(async () => {
    const res = await api.post<UploadedAttachment[]>(
      "storage/upload",
      formData
    );
    return {
      error: false,
      data: res,
      message: "Archivos subidos exitosamente",
    };
  });
};

export const deleteAttachment = async (
  id: string
): Promise<ServiceResponse<void>> => {
  return handleServerAction(async () => {
    await api.delete(`storage/${id}`);
    return {
      error: false,
      data: undefined,
      message: "Archivo eliminado",
    };
  });
};
