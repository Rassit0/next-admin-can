import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { IPersonsResponse } from "@/modules/persons";
import { handleServerAction } from "@/utils";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  callbackUrl?: string;
}

export const getPersons = async ({
  search,
  per_page = "5",
  page = "1",
}: SearchParams): Promise<ServiceResponse<IPersonsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);

    const res = await api.get<IPersonsResponse>(
      `persons?${params.toString()}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["persons"],
          revalidate: 3600,
        },
      },
    );

    const persons = res.data.map((person) => ({
      ...person,
      birthDate: person.birthDate ? new Date(person.birthDate) : null,
      createdAt: new Date(person.createdAt),
      updatedAt: new Date(person.updatedAt),
    }));
    return {
      error: false,
      data: { ...res, data: persons },
      message: "Miembros obtenidos exitosamente",
    };
  });
};
