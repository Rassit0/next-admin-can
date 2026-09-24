import { api } from "@/utils/api";
import { handleServerAction } from "@/utils/handleServerAction";
import { ServiceResponse } from "@/types/api";
import { auth } from "@/auth";

export interface InstitutionHistorySettings {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

export interface InstitutionHistoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getInstitutionHistorySettings(): Promise<ServiceResponse<InstitutionHistorySettings>> {
  return handleServerAction(async () => {
    const res = await api.get<InstitutionHistorySettings>("institution-history/settings", {
      next: { tags: ["institution-history"] },
    });
    return { error: false, data: res, message: "Settings obtenidos" };
  });
}

export async function getInstitutionHistoryItems(): Promise<ServiceResponse<InstitutionHistoryItem[]>> {
  return handleServerAction(async () => {
    const res = await api.get<InstitutionHistoryItem[]>("institution-history/items", {
      next: { tags: ["institution-history"] },
    });
    return { error: false, data: res, message: "Items obtenidos" };
  });
}
