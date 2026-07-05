"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPlayer } from "@/modules/players";

interface Props {
  id: number;
}

export const deletePlayer = async ({
  id,
}: Props): Promise<ServiceResponse<IPlayer>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: IPlayer }>(
      `players/${id}`,
    );

    updateTag("players");
    return {
      error: false,
      data: res.data,
      message: res.message || "Jugador eliminado exitosamente",
    };
  });
};
