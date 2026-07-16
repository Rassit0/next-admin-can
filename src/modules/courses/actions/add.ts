"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICourse } from "@/modules/courses";
import { handleServerAction } from "@/utils";

export const addCourse = async (data: {
  name: string;
  description: string | null;
  schoolId: string;
}): Promise<ServiceResponse<ICourse>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ICourse }>(
      `courses`,
      data,
    );

    updateTag("courses");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo agregado exitosamente",
    };
  });
};
