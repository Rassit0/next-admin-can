"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const applyLateFee = async (
  chargeId: string,
  type: 'student' | 'membership' = 'student',
  customAmount?: number
): Promise<ServiceResponse<boolean>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const endpointPrefix = type === 'membership' ? 'membership-charges' : 'student-charges';
    const res = await api.post<any>(
      `${endpointPrefix}/${chargeId}/late-fee/apply`,
      { customAmount },
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    return {
      error: false,
      data: true,
      message: res.message || "Mora aplicada exitosamente",
    };
  });
};
