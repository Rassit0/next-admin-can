"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ICourseSeason } from "../interfaces/course-seasons.interface";
import { PostOfferingInterface } from "../interfaces/post-course-seasons.interface";

interface Props {
  id: string;
  data: PostOfferingInterface;
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
      data: {
        ...response.data,
        startDate: new Date(response.data.startDate),
        endDate: new Date(response.data.endDate),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      },
      message: response.message || "Temporada del equipo editada exitosamente",
    };
  });
};
