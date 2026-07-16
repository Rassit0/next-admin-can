"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ISchool } from "../interfaces/school.interface";

export const addSchool = async (data: {
  name: string;
  disciplineId: string;
}): Promise<ServiceResponse<ISchool>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ISchool }>(
      `schools`,
      data,
    );

    updateTag("schools");
    return {
      error: false,
      data: response.data,
      message: response.message || "School agregado exitosamente",
    };
  });
};
