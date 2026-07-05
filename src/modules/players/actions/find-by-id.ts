import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { IPlayer } from "@/modules/players";
import { handleServerAction } from "@/utils";

interface SearchParams {
  id: string;
}

export const getPlayerById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IPlayer>> => {
  return handleServerAction(async () => {
    console.log("entro", id);
    const res = await api.get<{ data: IPlayer; message: string }>(
      `players/${id}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        // next: {
        //   tags: ["players"],
        //   revalidate: 3600,
        // },
      },
    );
    console.log(res.data);

    const player: IPlayer = {
      ...res.data,
      person: {
        ...res.data.person,
        birthDate: res.data.person.birthDate
          ? new Date(res.data.person.birthDate)
          : null,
        createdAt: new Date(res.data.person.createdAt),
        updatedAt: new Date(res.data.person.updatedAt),
      },
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };
    return {
      error: false,
      data: player,
      message: res.message || "Jugador obtenido exitosamente",
    };
  });
};
