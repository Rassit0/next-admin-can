import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITeamSeason } from "@/modules/team-membership-offerings";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getTeamSeasonById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeamSeason }>(
      `team-seasons/${id}`,
      {
        next: {
          tags: ["team-seasons"],
          revalidate: 3600,
        },
      },
    );

    console.log(res.data);

    return {
      error: false,
      data: {
        ...res.data,
        startDate: new Date(res.data.startDate),
        endDate: new Date(res.data.endDate),
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Temporada del equipo obtenida exitosamente",
    };
  });
};
