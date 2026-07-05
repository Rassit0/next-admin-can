"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ISeason } from "../interfaces/season.interface";

export const addSeason = async (data: {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  institutionId: string;
  disciplineId: string;
}): Promise<ServiceResponse<ISeason>> => {
  const body = {
    name: data.name,
    description: data.description,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
    institutionId: data.institutionId,
    disciplineId: data.disciplineId,
  };
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: ISeason }>(
      `seasons`,
      body,
    );

    updateTag("seasons");
    return {
      error: false,
      data: {
        ...response.data,
        startDate: new Date(response.data.startDate),
        endDate: new Date(response.data.endDate),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      },
      message: response.message || "Temporada agregada exitosamente",
    };
  });
};
