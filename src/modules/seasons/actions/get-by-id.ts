import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeason } from "../interfaces/season.interface";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getSeasonById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ISeason>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ISeason }>(
      `seasons/${id}`,
      {
        next: {
          tags: ["seasons"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        startDate: new Date(res.data.startDate),
        endDate: new Date(res.data.endDate),
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Temporada obtenida exitosamente",
    };
  });
};
