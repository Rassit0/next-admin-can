"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeam } from "@/modules/teams";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    name: string;
    description: string | null;
    clubId: string;
  };
}

export const editTeam = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ITeam>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeam }>(
      `teams/${id}`,
      data,
    );

    updateTag("teams");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo editado exitosamente",
    };
  });
};
