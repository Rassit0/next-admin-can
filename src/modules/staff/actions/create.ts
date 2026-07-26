"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";

import { IStaff } from "../interfaces";

export const createStaff = async (
  personId: string,
): Promise<ServiceResponse<IStaff>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IStaff;
    }>(`staff`, { personId, isActive: true });

    updateTag("staff");
    
    // Parse the date
    if (response.data?.person?.birthDate) {
      response.data.person.birthDate = new Date(response.data.person.birthDate);
    }

    return {
      error: false,
      data: response.data,
      message: response.message || "Personal registrado exitosamente",
    };
  });
};
