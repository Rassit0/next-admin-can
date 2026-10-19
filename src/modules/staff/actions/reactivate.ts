"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStaff } from "../interfaces";

export const reactivateStaff = async (
  id: string,
): Promise<ServiceResponse<IStaff>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{
      message: string;
      data: IStaff;
    }>(`staff/${id}/reactivate`, {});

    updateTag("staff");

    if (response.data?.person?.birthDate) {
      response.data.person.birthDate = new Date(response.data.person.birthDate);
    }

    return {
      error: false,
      data: response.data,
      message: response.message || "Personal reactivado exitosamente",
    };
  });
};
