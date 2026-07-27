"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Club } from "@/modules/team-seasons";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getClubContext = async ({
  id,
}: SearchParams): Promise<ServiceResponse<Club>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: Club }>(
      `team-seasons/club/context/${id}`,
      {
        next: {
          tags: ["clubs"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: res.data,
      message: "Club obtenido exitosamente",
    };
  });
};
