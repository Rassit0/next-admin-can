import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IStudentMembership,
  IStudentMembershipResponse,
} from "@/modules/student-memberships";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  courseSeasonId: string;
  status?: string;
  studentId?: string;
  paymentPlanId?: string;
}

const parseMembership = (
  membership: IStudentMembership,
): IStudentMembership => ({
  ...membership,
  startedAt: membership.startedAt ? new Date(membership.startedAt) : new Date(),
  finishedAt: membership.finishedAt ? new Date(membership.finishedAt) : null,
  createdAt: membership.createdAt ? new Date(membership.createdAt) : new Date(),
  updatedAt: membership.updatedAt ? new Date(membership.updatedAt) : new Date(),
});

export const getStudentMemberships = async ({
  search,
  per_page = "10",
  page = "1",
  courseSeasonId,
  status,
  studentId,
  paymentPlanId,
}: SearchParams): Promise<ServiceResponse<IStudentMembershipResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (status) params.set("status", status);
    if (studentId) params.set("studentId", studentId);
    if (paymentPlanId) params.set("paymentPlanId", paymentPlanId);
    params.set("courseSeasonId", courseSeasonId);

    const res = await api.get<IStudentMembershipResponse>(
      `student-memberships?${params.toString()}`,
      {
        next: {
          tags: ["student-memberships", "charges", "students", "persons"],
          revalidate: 3600,
        },
      },
    );

    const data = (res.data ?? []).map(parseMembership);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Membresías obtenidas exitosamente",
    };
  });
};
