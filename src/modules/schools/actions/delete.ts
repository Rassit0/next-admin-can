"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ISchool } from "../interfaces/school.interface";

export const deleteSchool = async (
  id: string,
): Promise<ServiceResponse<ISchool>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: ISchool }>(
      `schools/${id}`,
    );

    updateTag("schools");
    return {
      error: false,
      data: response.data,
      message: response.message || "School eliminado exitosamente",
    };
  });
};
