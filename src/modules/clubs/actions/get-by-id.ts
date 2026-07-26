"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IClub } from "../interfaces/club.interface";
import { auth } from "@/auth";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getClubById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IClub>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IClub }>(`clubs/${id}`, {
      next: {
        tags: ["clubs"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
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
