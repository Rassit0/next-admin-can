"use server";

import { api } from "@/modules/portal/core/api/api";
import { handleServerAction } from "@/modules/portal/core/utils/handleServerAction";
import { ServiceResponse } from "@/types/api";
import { PublicInstitutionHistoryResponse } from "@/modules/portal/institutions/interfaces/history.interface";

export const getPublicInstitutionHistory = async (): Promise<
  ServiceResponse<PublicInstitutionHistoryResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<PublicInstitutionHistoryResponse>(
      "public/institution-history",
      {
        next: { tags: ["institution-history"] },
      },
    );

    return {
      error: false,
      data: res,
      message: "Historia obtenida exitosamente",
    } as ServiceResponse<PublicInstitutionHistoryResponse>;
  }) as Promise<ServiceResponse<PublicInstitutionHistoryResponse>>;
};
