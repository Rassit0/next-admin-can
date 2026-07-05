"use server";
import { IDisciplinesResponse } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { handleServerAction } from "@/utils";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  callbackUrl?: string;
}

export const getDisciplines = async ({
  search,
  per_page = "5",
  page = "1",
}: SearchParams): Promise<ServiceResponse<IDisciplinesResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);

    const res = await api.get<IDisciplinesResponse>(
      `disciplines?${params.toString()}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["disciplines"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: "Disciplinas obtenidas exitosamente",
    };
  });
};
