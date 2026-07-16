"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IStudent, PostStudentInterface } from "@/modules/students";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: PostStudentInterface;
}

export const editStudent = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IStudent>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: IStudent }>(
      `students/${id}`,
      data,
    );

    console.log(res);

    updateTag("students");
    return {
      error: false,
      data: res.data,
      message: res.message || "Jugador editado exitosamente",
    };
  });
};
