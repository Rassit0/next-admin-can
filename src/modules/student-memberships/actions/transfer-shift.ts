"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export interface TransferShiftInput {
  targetCourseSeasonId: string;
  effectiveDate: string;
}

export const transferShift = async (
  membershipId: string,
  data: TransferShiftInput,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const response = await api.post<any>(
      `student-memberships/${membershipId}/transfer-shift`,
      data,
    );

    updateTag("student-memberships");
    updateTag("course-seasons");
    updateTag("charges");

    return {
      error: false,
      data: response.data,
      message: response.message || "Turno transferido exitosamente",
    };
  });
};
