"use server";

import { api } from "@/modules/web/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/web/core/utils/handleServerAction";

export interface PublicCourse {
  id: string;
  name: string;
  discipline: string;
  minAge: number;
  maxAge: number;
  schedule: string;
  professor: string;
  capacity: number;
  enrolled: number;
  registrationFee: number;
  monthlyFee: number;
}

export const getPublicCourses = async (): Promise<ServiceResponse<PublicCourse[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: PublicCourse[] }>(
      `public/course-seasons`,
      {
        next: {
          tags: ["public-courses"],
          revalidate: 3600, // Revalidar cada hora
        },
      },
    );

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Cursos públicos obtenidos exitosamente",
    };
  });
};
