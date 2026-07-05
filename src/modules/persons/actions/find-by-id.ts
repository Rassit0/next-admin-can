import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { IPerson } from "@/modules/persons";
import { handleServerAction } from "@/utils";

interface SearchParams {
  id: number;
}

export const findPersonById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IPerson>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ data: IPerson; message: string }>(
      `persons/${id}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["persons"],
          revalidate: 3600,
        },
      },
    );

    const person = {
      ...res.data,
      birthDate: res.data.birthDate ? new Date(res.data.birthDate) : null,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };
    return {
      error: false,
      data: person,
      message: "Miembro obtenido exitosamente",
    };
  });
};
