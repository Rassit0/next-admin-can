"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISponsor } from "@/modules/cms/sponsors/interfaces/sponsor.interface";
import { auth } from "@/auth";

export const getSponsors = async (): Promise<
  ServiceResponse<ISponsor[]>
> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const res = await api.get<ISponsor[]>("sponsors", {
      next: {
        tags: ["admin-sponsors"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Auspiciadores obtenidos exitosamente",
    };
  });
};

export const getPublicSponsors = async (): Promise<
  ServiceResponse<ISponsor[]>
> => {
  return handleServerAction(async () => {
    const res = await api.get<ISponsor[]>("public/sponsors", {
      next: {
        tags: ["public-sponsors"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: res,
      message: "Auspiciadores públicos obtenidos",
    };
  });
};
