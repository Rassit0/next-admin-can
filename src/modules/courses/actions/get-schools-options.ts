"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  ISchoolOptions,
  ISchoolOptionsResponse,
} from "../interfaces/options.course.interface";

export const getSchoolsOptions = async (
  disciplineId: string,
): Promise<ServiceResponse<ISchoolOptionsResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<ISchoolOptionsResponse>(
      `courses/schools-by-discipline/options/${disciplineId}`,
      {
        next: {
          tags: ["schools"],
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
