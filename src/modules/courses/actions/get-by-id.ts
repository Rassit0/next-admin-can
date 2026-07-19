"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICourse } from "../interfaces/course.interface";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getCourseById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ICourse>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ICourse }>(
      `courses/${id}`,
      {
        next: {
          tags: ["courses"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Equipo obtenido exitosamente",
    };
  });
};
