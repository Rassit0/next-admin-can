import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISchoolOptionsResponse } from "../interfaces/options.school.interface";

export const getSchoolsOptions = async (): Promise<
  ServiceResponse<ISchoolOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<ISchoolOptionsResponse>(`schools/all/options`, {
      next: {
        tags: ["schools"],
        revalidate: 60 * 60 * 24 * 7, //1 semana
      },
    });

    return {
      error: false,
      data: res,
      message: res.message || "Schools obtenidos exitosamente",
    };
  });
};
