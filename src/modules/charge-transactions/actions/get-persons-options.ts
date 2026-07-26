"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPersonsOptionsResponse } from "@/modules/charge-transactions";
import { auth } from "@/auth";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  orderBy?: string;
}

export const getPersonsOptions = async (
  { search, per_page = "10", page = "1", orderBy = "asc" }: SearchParams,
  signal?: AbortSignal,
): Promise<ServiceResponse<IPersonsOptionsResponse>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IPersonsOptionsResponse>(
      `transactions/persons-options?${params.toString()}`,
      {
        next: {
          tags: ["persons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
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
      message: res.message || "Personas obtenidas exitosamente",
    };
  });
};
