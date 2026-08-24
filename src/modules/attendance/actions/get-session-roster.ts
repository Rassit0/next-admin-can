"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import {
  IStudentMembership,
  IStudentMembershipResponse,
} from "@/modules/student-memberships";

const parseMembership = (
  membership: IStudentMembership,
): IStudentMembership => ({
  ...membership,
  startedAt: membership.startedAt ? new Date(membership.startedAt) : new Date(),
  finishedAt: membership.finishedAt ? new Date(membership.finishedAt) : null,
  createdAt: membership.createdAt ? new Date(membership.createdAt) : new Date(),
  updatedAt: membership.updatedAt ? new Date(membership.updatedAt) : new Date(),
});

export const getSessionRoster = async (
  courseSeasonId: string,
  physicalDate: string, // ISO string (e.g. session.event.startDate)
): Promise<ServiceResponse<IStudentMembershipResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    params.set("courseSeasonId", courseSeasonId);
    params.set("physicalDate", physicalDate);
    // Fetch practically everything since it's a roster
    params.set("per_page", "1000");

    const res = await api.get<IStudentMembershipResponse>(
      `student-memberships?${params.toString()}`,
    );

    const data = (res.data ?? []).map(parseMembership);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Roster obtenido exitosamente",
    };
  });
};
