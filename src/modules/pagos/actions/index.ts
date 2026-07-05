"use server";

import { api } from "@/utils/api";
import { handleServerAction } from "@/utils";
import { ServiceResponse } from "@/types/api";
import {
  IPaymentRecord,
  IPaymentRecordResponse,
  IPaymentInput,
  IPaymentResponse,
} from "@/modules/pagos/types";

interface GetPaymentsParams {
  assignmentId?: string;
  status?: string;
  page?: string;
  per_page?: string;
  startDate?: string;
  endDate?: string;
}

interface GetPaymentsForTeamSeasonParams {
  teamSeasonId: string;
  status?: string;
  page?: string;
  per_page?: string;
  search?: string;
}

const parsePayment = (payment: IPaymentRecord): IPaymentRecord => ({
  ...payment,
  processedAt: payment.processedAt ? new Date(payment.processedAt) : null,
  createdAt: payment.createdAt ? new Date(payment.createdAt) : new Date(),
  updatedAt: payment.updatedAt ? new Date(payment.updatedAt) : new Date(),
});

export const getPaymentRecords = async (
  params: GetPaymentsParams,
): Promise<ServiceResponse<IPaymentRecordResponse>> => {
  return handleServerAction(async () => {
    const queryParams = new URLSearchParams();
    if (params.assignmentId) queryParams.set("assignmentId", params.assignmentId);
    if (params.status) queryParams.set("status", params.status);
    if (params.page) queryParams.set("page", params.page);
    if (params.per_page) queryParams.set("per_page", params.per_page);
    if (params.startDate) queryParams.set("startDate", params.startDate);
    if (params.endDate) queryParams.set("endDate", params.endDate);

    const res = await api.get<IPaymentRecordResponse>(
      `/payments?${queryParams.toString()}`,
      {
        next: {
          tags: ["payment-records"],
          revalidate: 1800,
        },
      },
    );

    const data = (res.data || []).map(parsePayment);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Registros de pago obtenidos exitosamente",
    };
  });
};

export const processPayment = async (
  payload: IPaymentInput,
): Promise<ServiceResponse<IPaymentResponse>> => {
  return handleServerAction(async () => {
    const sanitizedPayload = {
      assignmentId: payload.assignmentId,
      amount: payload.amount,
      method: payload.method,
      notes: payload.notes,
    };

    const res = await api.post<IPaymentResponse>(
      "/payments/process",
      sanitizedPayload,
    );

    return {
      error: false,
      data: res,
      message: res.message || "Pago procesado exitosamente",
    };
  });
};

export const retryPayment = async (
  paymentId: string,
): Promise<ServiceResponse<IPaymentRecord>> => {
  return handleServerAction(async () => {
    const res = await api.post<IPaymentRecord>(
      `/payments/${paymentId}/retry`,
      {},
    );

    const payment = parsePayment(res);

    return {
      error: false,
      data: payment,
      message: "Reintento de pago iniciado",
    };
  });
};

export const cancelPayment = async (
  paymentId: string,
): Promise<ServiceResponse<IPaymentRecord>> => {
  return handleServerAction(async () => {
    const res = await api.post<IPaymentRecord>(
      `/payments/${paymentId}/cancel`,
      {},
    );

    const payment = parsePayment(res);

    return {
      error: false,
      data: payment,
      message: "Pago cancelado exitosamente",
    };
  });
};

export const getPaymentMetrics = async (
  teamSeasonId: string,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const res = await api.get(
      `/payments/metrics?teamSeasonId=${teamSeasonId}`,
      {
        next: {
          tags: ["payment-metrics"],
          revalidate: 1800,
        },
      },
    );

    return {
      error: false,
      data: res,
      message: "Métricas obtenidas exitosamente",
    };
  });
};

export const getPaymentsForTeamSeason = async (
  params: GetPaymentsForTeamSeasonParams,
): Promise<ServiceResponse<IPaymentRecordResponse>> => {
  return handleServerAction(async () => {
    const queryParams = new URLSearchParams();
    queryParams.set("teamSeasonId", params.teamSeasonId);
    if (params.status) queryParams.set("status", params.status);
    if (params.page) queryParams.set("page", params.page);
    if (params.per_page) queryParams.set("per_page", params.per_page);
    if (params.search) queryParams.set("search", params.search);

    const res = await api.get<IPaymentRecordResponse>(
      `/payments?${queryParams.toString()}`,
      {
        next: {
          tags: ["payment-records"],
          revalidate: 1800,
        },
      },
    );

    const data = (res.data || []).map(parsePayment);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Registros de pago obtenidos exitosamente",
    };
  });
};
