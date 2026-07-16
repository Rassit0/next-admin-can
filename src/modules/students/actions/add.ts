"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { IStudent, PostStudentInterface } from "@/modules/students";
import { handleServerAction } from "@/utils";

interface Props {
  data: PostStudentInterface;
}

export const addStudent = async ({
  data,
}: Props): Promise<ServiceResponse<IStudent>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: IStudent }>(
      `students`,
      data,
    );

    updateTag("students");
    return {
      error: false,
      data: res.data,
      message: res.message || "Jugador agregado exitosamente",
    };
  });
};
