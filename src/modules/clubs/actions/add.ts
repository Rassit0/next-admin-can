"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IClub } from "../interfaces/club.interface";

export const addClub = async (
  formData: FormData
): Promise<ServiceResponse<IClub>> => {
  return handleServerAction(async () => {
    const response = await api.post<{ message: string; data: IClub }>(
      `clubs`,
      formData
    );

    updateTag("clubs");
    return {
      error: false,
      data: response.data,
      message: response.message || "Club agregado exitosamente",
    };
  });
};
