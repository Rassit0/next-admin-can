import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITeamCategory } from "@/modules/team-categories";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ITeamCategory>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeamCategory }>(
      `team-categories/${id}`,
      {
        next: {
          tags: ["team-categories"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Categoria de equipo obtenida exitosamente",
    };
  });
};
