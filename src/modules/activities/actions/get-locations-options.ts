import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ILocationOptionsResponse } from "../interfaces/options.ativity.interface";

export const getLocationsOptions = async (): Promise<
  ServiceResponse<ILocationOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<ILocationOptionsResponse>(
      `activities/locations/options`,
      {
        next: {
          tags: ["locations"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Ubicaciones obtenidas exitosamente",
    };
  });
};
