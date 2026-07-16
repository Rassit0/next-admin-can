import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IDisciplineOptions,
  IDisciplineOptionsResponse,
} from "../interfaces/options.course.interface";

export const getDisciplinesOptions = async (): Promise<
  ServiceResponse<IDisciplineOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<IDisciplineOptionsResponse>(
      `courses/disciplines/options`,
      {
        next: {
          tags: ["disciplines"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: {
        ...res,
      },
      message: res.message || "Schooles obtenidos exitosamente",
    };
  });
};
