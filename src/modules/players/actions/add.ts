"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { IPlayer, PostPlayerInterface } from "@/modules/players";
import { handleServerAction } from "@/utils";

interface Props {
  data: PostPlayerInterface;
}

export const addPlayer = async ({
  data,
}: Props): Promise<ServiceResponse<IPlayer>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: IPlayer }>(
      `players`,
      data,
    );

    updateTag("players");
    return {
      error: false,
      data: res.data,
      message: res.message || "Jugador agregado exitosamente",
    };
  });
};
