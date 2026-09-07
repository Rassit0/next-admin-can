"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { auth } from "@/auth";
import { IPersonContact } from "../interfaces/person-contact.interface";

export const getPersonContacts = async (
  personId: string,
  signal?: AbortSignal,
): Promise<ServiceResponse<IPersonContact[]>> => {
  const session = await auth();

  if (!session?.user?.token)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IPersonContact[] }>(
      `persons/${personId}/contacts`,
      {
        next: {
          tags: [`person-${personId}-contacts`],
          revalidate: 60, // Revalidate every minute or when invalidated manually
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
        signal,
      },
    );

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Contactos obtenidos exitosamente",
    };
  });
};
