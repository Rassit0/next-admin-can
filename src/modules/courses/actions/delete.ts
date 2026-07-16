"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourse } from "../interfaces/course.interface";

export const deleteCourse = async (
  id: string,
): Promise<ServiceResponse<ICourse>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ICourse }>(
      `courses/${id}`,
    );

    updateTag("courses");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo eliminado exitosamente",
    };
  });
};
