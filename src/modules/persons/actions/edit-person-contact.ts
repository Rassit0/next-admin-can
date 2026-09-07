"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";

export interface IEditPersonContactData {
  relationship?: string;
  isEmergencyContact?: boolean;
  isBillingContact?: boolean;
}

export const editPersonContact = async (
  personId: string,
  contactPersonId: string,
  data: IEditPersonContactData,
): Promise<ServiceResponse<null>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.patch<{ message: string }>(
      `persons/${personId}/contacts/${contactPersonId}`,
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
      message: res.message || "Contacto editado exitosamente",
    };
  });
};
