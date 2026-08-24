"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudentMembership } from "@/modules/student-memberships";

export const reactivateStudentMembership = async ({
  membershipId,
  quantity,
  reentryDate,
}: {
  membershipId: string;
  quantity: number;
  reentryDate?: string;
}): Promise<ServiceResponse<IStudentMembership>> => {
  return handleServerAction(async () => {
    const payload: { quantity: number; reentryDate?: string } = { quantity };
    if (reentryDate) {
      payload.reentryDate = reentryDate;
    }

    const response = await api.post<{
      message: string;
      data: IStudentMembership;
    }>(`student-charges/${membershipId}/reactivation`, payload);

    updateTag("student-memberships");
    updateTag(`student-membership-${membershipId}`);
    return {
      error: false,
      data: response.data,
      message: response.message || "Reingreso al curso procesado exitosamente",
    };
  });
};
