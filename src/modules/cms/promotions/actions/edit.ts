"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import {
  IPromotion,
  UpdatePromotionInterface,
} from "@/modules/cms/promotions/interfaces/promotions.interface";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const editPromotion = async (
  id: string,
  data: FormData,
): Promise<ServiceResponse<IPromotion>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado.",
    } as any;

  return handleServerAction(async () => {
    const response = await api.patch<IPromotion>(`promotions/${id}`, data, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    updateTag("public-promotions");
    updateTag("admin-promotions");

    return {
      error: false,
      data: response,
      message: "Promotion actualizado exitosamente",
    };
  });
};
