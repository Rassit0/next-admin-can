"use server";

import { api } from "@/utils/api";
import { updateTag } from "next/cache";
import { ICreateSchedulePayload } from "../interfaces/schedule.interface";
import { handleServerAction } from "@/utils";

export const createScheduleAction = async (payload: ICreateSchedulePayload) => {
  return handleServerAction(async () => {
    const res = await api.post("sessions", payload);

    // Invalidamos el caché del calendario y de las sesiones
    updateTag("calendar");
    updateTag("sessions");
    updateTag("teacher-sessions");
    updateTag("staff-groups");
    updateTag("course-seasons");
    updateTag("team-seasons");

    return {
      error: false,
      data: res,
      message: "Horario creado y programado exitosamente",
    };
  });
};
