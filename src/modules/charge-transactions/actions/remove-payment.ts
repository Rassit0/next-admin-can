"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IChargePayment } from "../interfaces/payments.interface";
import { auth } from "@/auth";
import { updateTag } from "next/cache";

export const removePayment = async (
  id: string,
): Promise<ServiceResponse<IChargePayment>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.delete<{ message: string; data: IChargePayment }>(
      `payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    // @ts-ignore - Next 16 requires 2 args for some reason
    updateTag("payments");
    // @ts-ignore
    updateTag("transactions");
    // @ts-ignore
    updateTag("charges");

    return {
      error: false,
      data: res.data,
      message: res.message || "Pago anulado correctamente",
    };
  });
};
