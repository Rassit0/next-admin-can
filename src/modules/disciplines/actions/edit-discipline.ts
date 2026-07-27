"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

interface Props {
  id: number;
  data: {
    name: string;
    icon: string;
  };
}

export const editDiscipline = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IDiscipline>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IDiscipline }>(
      `disciplines/${id}`,
      data,
    );

    updateTag("disciplines");
    return {
      error: false,
      data: response.data,
      message: response.message || "Disciplina editada exitosamente",
    };
  });
};
