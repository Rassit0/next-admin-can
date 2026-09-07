"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface IAddPersonContactData {
  contactPersonId: string;
  relationship: string;
  isEmergencyContact?: boolean;
  isBillingContact?: boolean;
}

export const addPersonContact = async (
  personId: string,
  data: IAddPersonContactData,
): Promise<ServiceResponse<null>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.post<{ message: string }>(
      `persons/${personId}/contacts`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    return {
      error: false,
      data: null,
      message: res.message || "Contacto agregado exitosamente",
    };
  });
};
