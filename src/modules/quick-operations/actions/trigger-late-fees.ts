"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export const triggerLateFeesAction = async (): Promise<ServiceResponse<void>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    // We execute the club engine
    await api.post("membership-charges/apply-mass", undefined, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return {
      error: false,
      data: undefined,
      message: "Motor de moras ejecutado exitosamente. Los recargos se han sincronizado.",
    };
  });
};
