"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

import { IStaff, normalizeStaffPerson } from "../interfaces";

export const createStaff = async (
  personId: string,
): Promise<ServiceResponse<IStaff>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IStaff;
    }>(`staff`, { personId, isActive: true });

    updateTag("staff");
    
    if (response.data?.person) {
      response.data.person = normalizeStaffPerson(response.data.person);
    }

    return {
      error: false,
      data: response.data,
      message: response.message || "Personal registrado exitosamente",
    };
  });
};
