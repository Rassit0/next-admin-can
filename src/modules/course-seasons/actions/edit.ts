"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPostCourseSeason, ICourseSeason } from "@/modules/course-seasons";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: IPostCourseSeason;
}

export const editCourseSeason = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ICourseSeason>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ICourseSeason }>(
      `course-seasons/${id}`,
      data,
    );

    updateTag("course-seasons");
    return {
      error: false,
      data: response.data,
      message: response.message || "Temporada editada exitosamente",
    };
  });
};
