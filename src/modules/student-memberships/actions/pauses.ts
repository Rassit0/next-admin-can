"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudentMembershipPause } from "../interfaces/student-membership.interface";

export const createMembershipPause = async ({
  id,
  startDate,
  endDate,
  reason,
}: {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}): Promise<ServiceResponse<IStudentMembershipPause>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IStudentMembershipPause;
    }>(`student-memberships/${id}/pauses`, { startDate, endDate, reason });

    updateTag("student-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Pausa creada exitosamente",
    };
  });
};

export const getMembershipPauses = async (
  id: string,
): Promise<ServiceResponse<IStudentMembershipPause[]>> => {
  return handleServerAction(async () => {
    const response = await api.get<{
      message: string;
      data: IStudentMembershipPause[];
    }>(`student-memberships/${id}/pauses`);

    return {
      error: false,
      data: response.data,
      message: response.message,
    };
  });
};
