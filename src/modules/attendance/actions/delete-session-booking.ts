"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export const deleteSessionBooking = async (
  id: string,
): Promise<ServiceResponse<null>> => {
  return handleServerAction(async () => {
    const res = await api.delete<{ message: string }>(`session-bookings/${id}`);

    return {
      error: false,
      data: null,
      message: res?.message || "Asistencia eliminada exitosamente",
    };
  });
};
