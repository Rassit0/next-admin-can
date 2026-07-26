"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { Club } from "@/modules/team-seasons";
import { auth } from "@/auth";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getClubContext = async ({
  id,
}: SearchParams): Promise<ServiceResponse<Club>> => {
  const session = await auth();
  console.log("session desde getClubContext:", session?.user);

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: Club }>(
      `team-seasons/club/context/${id}`,
      {
        next: {
          tags: ["clubs"],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
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
