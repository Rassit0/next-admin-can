import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IClubOptionsResponse } from "../interfaces/options.club.interface";

export const getClubsOptions = async (): Promise<
  ServiceResponse<IClubOptionsResponse>
> => {
  return handleServerAction(async () => {
    const res = await api.get<IClubOptionsResponse>(`clubs/all/options`, {
      next: {
        tags: ["clubs"],
        revalidate: 60 * 60 * 24 * 7, //1 semana
      },
    });

    return {
      error: false,
      data: res,
      message: res.message || "Clubs obtenidos exitosamente",
    };
  });
};
