"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPlayer, PostPlayerInterface } from "@/modules/players";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: PostPlayerInterface;
}

export const editPlayer = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IPlayer>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: IPlayer }>(
      `players/${id}`,
      data,
    );

    console.log(res);

    updateTag("players");
    return {
      error: false,
      data: res.data,
      message: res.message || "Jugador editado exitosamente",
    };
  });
};
