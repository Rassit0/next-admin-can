"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IChargePayment,
  IChargePaymentsResponse,
} from "../interfaces/payments.interface";
import { auth } from "@/auth";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  chargeId?: string;
}

const parsePayment = (payment: IChargePayment): IChargePayment => ({
  ...payment,
  paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date(),
  createdAt: payment.createdAt ? new Date(payment.createdAt) : new Date(),
  updatedAt: payment.updatedAt ? new Date(payment.updatedAt) : new Date(),
  transactions: (payment.transactions || []).map((t) => ({
    ...t,
    transactionDate: t.transactionDate ? new Date(t.transactionDate) : new Date(),
    createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
  })),
});

export const getPayments = async ({
  search,
  per_page = "10",
  page = "1",
  chargeId,
}: SearchParams): Promise<ServiceResponse<IChargePaymentsResponse>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (chargeId) params.set("chargeId", chargeId);

    const res = await api.get<IChargePaymentsResponse>(
      `payments?${params.toString()}`,
      {
        next: {
          tags: ["payments", "transactions"],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    const data = (res.data ?? []).map(parsePayment);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Pagos obtenidos exitosamente",
    };
  });
};
