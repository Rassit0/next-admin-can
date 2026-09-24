"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const deleteHeroBanner = async (
  id: string,
): Promise<ServiceResponse<void>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    await api.delete(`hero-banners/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-hero-banners");
    updateTag("admin-hero-banners");

    return {
      error: false,
      data: undefined,
      message: "Hero Banner eliminado exitosamente",
    };
  });
};
