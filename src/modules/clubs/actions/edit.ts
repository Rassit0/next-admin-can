"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IClub } from "../interfaces/club.interface";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  formData: FormData;
}

export const editClub = async ({
  id,
  formData,
}: Props): Promise<ServiceResponse<IClub>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IClub }>(
      `clubs/${id}`,
      formData
    );

    updateTag("clubs");
    return {
      error: false,
      data: response.data,
      message: response.message || "Club editado exitosamente",
    };
  });
};
