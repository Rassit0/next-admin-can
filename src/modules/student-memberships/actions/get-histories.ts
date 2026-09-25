"use server";

import { api } from "@/utils/api";
import { handleServerAction } from "@/utils";
import { ServiceResponse } from "@/types/api";
import { IStudentMembershipHistory } from "../interfaces/student-membership.interface";

const parseHistory = (
  history: IStudentMembershipHistory,
): IStudentMembershipHistory => ({
  ...history,
  createdAt: history.createdAt ? new Date(history.createdAt) : new Date(),
});

/**
 * Obtiene el historial de cambios de estado y transferencias de una membresía.
 */
export async function getStudentMembershipHistories(
  id: string,
): Promise<ServiceResponse<IStudentMembershipHistory[]>> {
  return handleServerAction(async () => {
    const response = await api.get<{ data: IStudentMembershipHistory[] }>(
      `student-memberships/${id}/histories`,
    );

    const parsedData = response.data.map(parseHistory);

    return {
      error: false,
      message: "Historial de membresía obtenido exitosamente",
      data: parsedData,
    };
  });
}
