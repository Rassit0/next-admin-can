"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IPerson } from "@/modules/persons";

interface Props {
  id: number;
}

export const deletePerson = async ({
  id,
}: Props): Promise<ServiceResponse<IPerson>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: IPerson }>(
      `persons/${id}`,
    );

    updateTag("persons");
    return {
      error: false,
      data: res.data,
      message: res.message || "Persona eliminada exitosamente",
    };
  });
};
