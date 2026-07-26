"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICharge } from "../interfaces/charges.interface";
import { auth } from "@/auth";

const parseCharge = (charge: ICharge): ICharge => ({
  ...charge,
  dueDate: charge.dueDate ? new Date(charge.dueDate) : new Date(),
  createdAt: charge.createdAt ? new Date(charge.createdAt) : new Date(),
  updatedAt: charge.updatedAt ? new Date(charge.updatedAt) : new Date(),
});

export const getChargeById = async (
  id: string,
): Promise<ServiceResponse<ICharge>> => {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      statusCode: 401,
      message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    };

  return handleServerAction(async () => {
    const res = await api.get<ServiceResponse<ICharge>>(`charges/${id}`, {
      next: {
        tags: ["charges", `charge-${id}`],
        revalidate: 3600,
      },
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    if (!res.data) {
      throw new Error("No se encontró el cargo");
    }

    return {
      error: false,
      data: parseCharge(res.data),
      message: res.message || "Cargo obtenido exitosamente",
    };
  });
};
