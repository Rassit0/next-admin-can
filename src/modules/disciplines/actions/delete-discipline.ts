"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

interface Props {
  id: number;
}

export const deleteDiscipline = async ({
  id,
}: Props): Promise<ServiceResponse<IDiscipline>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: IDiscipline }>(
      `disciplines/${id}`,
    );

    updateTag("disciplines");
    return {
      error: false,
      data: response.data,
      message: response.message || "Disciplina eliminada exitosamente",
    };
  });
};
