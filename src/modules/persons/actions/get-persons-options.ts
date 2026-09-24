"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { TGender } from "@/modules/persons";

export interface IPersonOption {
  id: string;
  fullName: string;
  documentType: string | null;
  documentNumber: string | null;
  imageUrl: string | null;
  name: string;
  lastName: string;
  secondLastName: string | null;
  gender: TGender | null;
  birthDate: Date | null;
}

export interface IPersonsOptionsResponse {
  data: IPersonOption[];
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
  orderBy?: string;
  excludeRole?: "PLAYER" | "STUDENT" | "STAFF" | "USER";
  gender?: string;
}

export const getPersonsOptions = async (
  {
    search,
    per_page = "10",
    page = "1",
    orderBy = "asc",
    excludeRole,
    gender,
  }: SearchParams,
  signal?: AbortSignal,
): Promise<ServiceResponse<IPersonsOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (excludeRole) params.set("excludeRole", excludeRole);
    if (gender) params.set("gender", gender);

    const res = await api.get<IPersonsOptionsResponse>(
      `persons/options?${params.toString()}`,
      {
        next: {
          tags: ["persons-options"],
          revalidate: 60 * 60 * 24 * 7, // 1 semana
        },
        signal,
      },
    );

    return {
      error: false,
      data: {
        ...res,
        data: res.data.map((person) => ({
          ...person,
          birthDate: person.birthDate ? new Date(person.birthDate) : null,
        })),
      },
      message: (res as any).message || "Personas obtenidas exitosamente",
    };
  });
};
