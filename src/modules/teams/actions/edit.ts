"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ITeam } from "@/modules/teams";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  formData: FormData;
}

export const editTeam = async ({
  id,
  formData,
}: Props): Promise<ServiceResponse<ITeam>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ITeam }>(
      `teams/${id}`,
      formData
    );

    updateTag("teams");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo editado exitosamente",
    };
  });
};
