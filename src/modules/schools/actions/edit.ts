"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { ISchool } from "../interfaces/school.interface";
import { handleServerAction } from "@/utils";

interface Props {
  id: string;
  data: {
    name: string;
    disciplineId: string;
  };
}

export const editSchool = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ISchool>> => {
  return handleServerAction(async () => {
    const response = await api.patch<{ message: string; data: ISchool }>(
      `schools/${id}`,
      data,
    );

    updateTag("schools");
    return {
      error: false,
      data: response.data,
      message: response.message || "School editado exitosamente",
    };
  });
};
