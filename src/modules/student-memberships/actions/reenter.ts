"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudentMembership } from "@/modules/student-memberships";

export interface ReenterStudentMembershipData {
  membershipId: string;
  effectiveDate: string;
  reason: string;
  courseSeasonShiftId?: string;
  notes?: string;
}

export const reenterStudentMembership = async (
  data: ReenterStudentMembershipData,
): Promise<ServiceResponse<IStudentMembership>> => {
  return handleServerAction(async () => {
    const { membershipId, ...payload } = data;

    const response = await api.post<{
      message: string;
      data: IStudentMembership;
    }>(`student-memberships/reenter/${membershipId}`, payload);

    updateTag("student-memberships");
    updateTag(`student-membership-${membershipId}`);
    return {
      error: false,
      data: response.data,
      message:
        response.message ||
        "Reingreso de estudiante registrado y reactivado exitosamente",
    };
  });
};
