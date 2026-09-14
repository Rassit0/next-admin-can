"use server";

import { api } from "@/modules/web/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/web/core/utils/handleServerAction";
import { Institution } from "@/modules/web/institutions/interfaces/institution.interface";
import { notFound } from "next/navigation";

export const getInstitution = async (): Promise<ServiceResponse<Institution>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: Institution }>(
      `public/institutions/default`,
      {
        next: {
          tags: ["institution-default"],
          revalidate: 3600, // Revalidar cada hora
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Institución obtenida exitosamente",
    };
  });
};
