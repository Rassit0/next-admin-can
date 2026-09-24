"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPromotion } from "@/modules/cms/promotions/interfaces/promotions.interface";
import { auth } from "@/auth";

export const getPromotions = async (): Promise<
  ServiceResponse<IPromotion[]>
> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const res = await api.get<IPromotion[]>("promotions", {
      next: {
        tags: ["admin-promotions"],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: res,
      message: "Promotions obtenidos exitosamente",
    };
  });
};
