"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { ILocationsResponse } from "../interfaces/location.interface";
import { handleServerAction } from "@/utils";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  callbackUrl?: string;
}

export const getLocations = async ({
  search,
  per_page = "5",
  page = "1",
}: SearchParams): Promise<ServiceResponse<ILocationsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);

    const res = await api.get<ILocationsResponse>(
      `locations?${params.toString()}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["locations"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: "Instalaciones obtenidas exitosamente",
    };
  });
};
