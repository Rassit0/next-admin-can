"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IClub } from "../interfaces/club.interface";

export const deleteClub = async (
  id: string,
): Promise<ServiceResponse<IClub>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{ message: string; data: IClub }>(
      `clubs/${id}`,
    );

    updateTag("clubs");
    return {
      error: false,
      data: response.data,
      message: response.message || "Club eliminado exitosamente",
    };
  });
};
