"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface ILateFeePreview {
  chargeId: string;
  dueDate: string;
  daysPassed: number;
  graceDays: number;
  punishableDays: number;
  lateFeePerDay: string;
  totalLateFeeAmount: string;
  originalAmount: string;
  message?: string;
  alreadyHasLateFee?: boolean;
}

export const previewLateFee = async (
  chargeId: string
): Promise<ServiceResponse<ILateFeePreview>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    // Note: The endpoint is /student-charges/:id/late-fee/preview
    const res = await api.post<{ data: ILateFeePreview; message?: string }>(
      `student-charges/${chargeId}/late-fee/preview`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    return {
      error: false,
      data: res.data,
      message: res.message || "Preview generado",
    };
  });
};
