"use server";

import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { fetchMyGroups } from "../api/teacher.api";
import { MyGroupsData } from "../interfaces/teacher.interface";

export const getMyGroups = async (): Promise<ServiceResponse<MyGroupsData>> => {
  return handleServerAction(async () => {
    const data = await fetchMyGroups();
    return {
      error: false,
      data,
      message: "Mis grupos obtenidos exitosamente",
    };
  });
};
