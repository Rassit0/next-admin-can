"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export interface CancelCycleInput {
  reason: string;
}

export const cancelCycleEnrollmentAction = async (
  cycleEnrollmentId: string,
  data: CancelCycleInput,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const response = await api.post<any>(
      `student-memberships/cycles/${cycleEnrollmentId}/cancel`,
      data,
    );

    updateTag("student-memberships");
    updateTag("course-seasons");
    updateTag("charges");
    updateTag("person-summary");

    return {
      error: false,
      data: response.data,
      message: response.message || "Ciclo cancelado exitosamente",
    };
  });
};
