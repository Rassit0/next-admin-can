"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IShiftsOptionsResponse } from "@/modules/course-seasons";

export const getShiftsOptions = async (): Promise<
  ServiceResponse<IShiftsOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<IShiftsOptionsResponse>(
      `course-seasons/shifts-by-institution/options`,
      {
        next: {
          tags: ["shifts"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Turnos obtenidos exitosamente",
    };
  });
};
