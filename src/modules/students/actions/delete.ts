"use server";
import { IDiscipline } from "@/modules/disciplines";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudent } from "@/modules/students";

interface Props {
  id: number;
}

export const deleteStudent = async ({
  id,
}: Props): Promise<ServiceResponse<IStudent>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: IStudent }>(
      `students/${id}`,
    );

    updateTag("students");
    return {
      error: false,
      data: res.data,
      message: res.message || "Jugador eliminado exitosamente",
    };
  });
};
