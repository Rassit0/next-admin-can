"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { IPerson } from "@/modules/persons";
import { handleServerAction } from "@/utils";
import { IPlayerPass, PostPlayerPassInterface } from "@/modules/players-passes";

interface Props {
  id: number;
  data: PostPlayerPassInterface;
}

export const editPerson = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IPlayerPass>> => {
  return handleServerAction(async () => {
    console.log("data", data);
    const formData = new FormData();
    formData.append("playerId", data.playerId);
    if (data.previousTeamId)
      formData.append("previousTeamId", data.previousTeamId);
    if (data.externalPreviousTeamName)
      formData.append(
        "externalPreviousTeamName",
        data.externalPreviousTeamName,
      );
    formData.append("currentTeamId", data.currentTeamId);
    formData.append("originType", data.originType);
    formData.append("startDate", data.startDate.toISOString());
    formData.append("status", data.status);
    if (data.notes) formData.append("notes", data.notes);

    const res = await api.patch<{ message: string; data: IPlayerPass }>(
      `player-passes/${id}`,
      formData,
    );

    updateTag("player-passes");
    return {
      error: false,
      data: res.data,
      message: res.message || "Pase de jugador agregado exitosamente",
    };
  });
};
