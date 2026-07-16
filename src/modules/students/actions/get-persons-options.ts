import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPersonsOptionsResponse } from "@/modules/students";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  orderBy?: string;
}

export const getPersonsOptions = async (
  {
    search,
    per_page = "10",
    page = "1",
    sortField = "fullName",
    orderBy = "asc",
  }: SearchParams,
  signal?: AbortSignal,
): Promise<ServiceResponse<IPersonsOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IPersonsOptionsResponse>(
      `students/available-persons-options?${params.toString()}`,
      {
        next: {
          tags: ["persons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
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
          birthDate: new Date(person.birthDate),
        })),
      },
      message: res.message || "Personas obtenidas exitosamente",
    };
  });
};
