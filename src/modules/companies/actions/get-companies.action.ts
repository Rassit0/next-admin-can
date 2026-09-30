"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICompanyOption } from "../interfaces/company.interface";

export interface ICompaniesOptionsResponse {
  data: ICompanyOption[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
}

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
}

export const getCompaniesOptions = async (
  { search, per_page = "10", page = "1" }: SearchParams,
  signal?: AbortSignal,
): Promise<ServiceResponse<ICompaniesOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);

    const res = await api.get<ICompaniesOptionsResponse>(
      `companies/options?${params.toString()}`,
      {
        next: {
          tags: ["companies"],
          revalidate: 60 * 60 * 24 * 7, // 1 semana
        },
        signal,
      },
    );

    return {
      error: false,
      data: res,
      message: (res as any).message || "Empresas obtenidas exitosamente",
    };
  });
};
