"use server";

import { handleServerAction } from "@/utils/handleServerAction";
import { updateTag } from "next/cache";
import { ServiceResponse } from "@/types/api";
import { InstitutionHistorySettings, InstitutionHistoryItem } from "./services";
import { api } from "@/utils/api";

export const updateInstitutionHistorySettingsAction = async (formData: FormData): Promise<ServiceResponse<InstitutionHistorySettings>> => {
  return handleServerAction(async () => {
    const res = await api.patch<InstitutionHistorySettings>("institution-history/settings", formData);
    updateTag("institution-history");
    return {
      error: false,
      data: res,
      message: "Configuración de Historia actualizada correctamente"
    };
  });
};

export const createInstitutionHistoryItemAction = async (data: any): Promise<ServiceResponse<InstitutionHistoryItem>> => {
  return handleServerAction(async () => {
    const res = await api.post<InstitutionHistoryItem>("institution-history/items", data);
    updateTag("institution-history");
    return {
      error: false,
      data: res,
      message: "Hito creado correctamente"
    };
  });
};

export const updateInstitutionHistoryItemAction = async (id: string, data: any): Promise<ServiceResponse<InstitutionHistoryItem>> => {
  return handleServerAction(async () => {
    const res = await api.patch<InstitutionHistoryItem>(`institution-history/items/${id}`, data);
    updateTag("institution-history");
    return {
      error: false,
      data: res,
      message: "Hito actualizado correctamente"
    };
  });
};

export const deleteInstitutionHistoryItemAction = async (id: string): Promise<ServiceResponse<boolean>> => {
  return handleServerAction(async () => {
    await api.delete<boolean>(`institution-history/items/${id}`);
    updateTag("institution-history");
    return {
      error: false,
      data: true,
      message: "Hito eliminado correctamente"
    };
  });
};
