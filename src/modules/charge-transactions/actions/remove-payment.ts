"use server";
import { revalidateTag } from "next/cache";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IChargePayment } from "../interfaces/payments.interface";
import { auth } from "@/auth";

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
    revalidateTag("payments");
    // @ts-ignore
    revalidateTag("transactions");
    // @ts-ignore
    revalidateTag("charges");

    return {
      error: false,
      data: res.data,
      message: res.message || "Pago anulado correctamente",
    };
  });
};
