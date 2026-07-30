"use server";

import { api } from "@/utils/api";
import { revalidateTag, updateTag } from "next/cache";
import { ICreateSchedulePayload } from "../interfaces/schedule.interface";
import { handleServerAction } from "@/utils";

export const createScheduleAction = async (payload: ICreateSchedulePayload) => {
  return handleServerAction(async () => {
    const res = await api.post("sessions", payload);

    // Invalidamos el caché del calendario y de las sesiones
    updateTag("calendar");
    updateTag("sessions");

    return {
      error: false,
      data: res,
      message: "Horario creado y programado exitosamente",
    };
  });
};
