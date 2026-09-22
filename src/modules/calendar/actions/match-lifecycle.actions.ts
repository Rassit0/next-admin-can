"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const completeMatch = async (id: string): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: any }>(
      `matches/${id}/complete`,
      {}
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido completado exitosamente",
    };
  });
};

export const cancelMatch = async (id: string): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: any }>(
      `matches/${id}/cancel`,
      {}
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido cancelado exitosamente",
    };
  });
};

export const reopenMatch = async (id: string): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: any }>(
      `matches/${id}/reopen`,
      {}
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido reabierto exitosamente",
    };
  });
};

export const restoreMatch = async (id: string): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: any }>(
      `matches/${id}/restore`,
      {}
    );

    updateTag("calendar");
    updateTag("public-fixtures");

    return {
      error: false,
      data: res.data,
      message: res.message || "Partido restaurado exitosamente",
    };
  });
};
