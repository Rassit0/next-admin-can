"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ICourse } from "@/modules/courses";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    name: string;
    description: string | null;
    schoolId: string;
  };
}

export const editCourse = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ICourse>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICourse }>(
      `courses/${id}`,
      data,
    );

    updateTag("courses");
    return {
      error: false,
      data: response.data,
      message: response.message || "Equipo editado exitosamente",
    };
  });
};
