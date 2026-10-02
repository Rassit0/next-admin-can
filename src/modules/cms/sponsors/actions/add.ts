"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ISponsor } from "@/modules/cms/sponsors/interfaces/sponsor.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const addSponsor = async (
  data: FormData,
): Promise<ServiceResponse<ISponsor>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const response = await api.post<ISponsor>("sponsors", data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-sponsors");
    updateTag("admin-sponsors");

    return {
      error: false,
      data: response,
      message: "Auspiciador creado exitosamente",
    };
  });
};
