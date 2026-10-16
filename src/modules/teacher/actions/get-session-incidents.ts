"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchGroupSessionIncidents } from "../api/teacher.api";
import { TeacherSessionIncidentsResponse } from "../interfaces/teacher.interface";

export const getSessionIncidents = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<ServiceResponse<TeacherSessionIncidentsResponse>> => {
  return handleServerAction(async () => {
    const data = await fetchGroupSessionIncidents(type, groupId, sessionId);
    return {
      error: false,
      data,
      message: "Incidentes obtenidos correctamente.",
    };
  });
};
