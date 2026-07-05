import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IClub } from "../interfaces/club.interface";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getClubById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IClub>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IClub }>(`clubs/${id}`, {
      next: {
        tags: ["clubs"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Club obtenido exitosamente",
    };
  });
};
