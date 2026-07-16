"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudentMembership } from "@/modules/student-memberships";

export const removeStudentMembership = async (
  id: string,
): Promise<ServiceResponse<IStudentMembership>> => {
  return handleServerAction(async () => {
    const response = await api.delete<{
      message: string;
      data: IStudentMembership;
    }>(`student-memberships/${id}`);

    updateTag("student-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Membresía eliminada exitosamente",
    };
  });
};
