"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudentMembership } from "@/modules/student-memberships";

export interface AddStudentMembershipData {
  studentId: string;
  courseSeasonId: string;
  paymentPlanId: string;
  startedAt: string;
  isMigrated: boolean;
  membershipDiscounts?: {
    registrationDiscountPercent: number;
    recurringDiscountPercent: number;
    seasonFeeDiscountPercent: number;
    startDate: string;
    endDate?: string;
    type: string;
    reason?: string;
  }[];
}

export const addStudentMembership = async (
  data: AddStudentMembershipData,
): Promise<ServiceResponse<IStudentMembership>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IStudentMembership;
    }>(`student-memberships`, data);

    updateTag("student-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || "Atleta inscrito exitosamente",
    };
  });
};
