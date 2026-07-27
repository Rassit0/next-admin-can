"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IClub } from "../interfaces/club.interface";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    name: string;
    disciplineId: string;
  };
}

export const editClub = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IClub>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: IClub }>(
      `clubs/${id}`,
      data,
    );

    updateTag("clubs");
    return {
      error: false,
      data: response.data,
      message: response.message || "Club editado exitosamente",
    };
  });
};
