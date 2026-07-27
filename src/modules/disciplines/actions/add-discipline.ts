"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

interface Props {
  data: {
    name: string;
    icon: string;
  };
}

export const addDiscipline = async ({
  data,
}: Props): Promise<ServiceResponse<IDiscipline>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: IDiscipline }>(
      `disciplines`,
      data,
    );

    updateTag("disciplines");
    return {
      error: false,
      data: res.data,
      message: res.message || "Disciplina agregada exitosamente",
    };
  });
};
