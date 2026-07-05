"use server";

import { api } from "@/utils/api";
import { handleServerAction } from "@/utils";
import { ServiceResponse } from "@/types/api";
import {
  IMemberTeamSeasonAssignment,
  IMemberTeamSeasonAssignmentResponse,
  IAssignMemberPayload,
} from "@/modules/membresias/types";

interface GetAssignmentsParams {
  teamSeasonId: string;
  page?: string;
  per_page?: string;
  status?: string;
  search?: string;
}

const parseAssignment = (
  assignment: IMemberTeamSeasonAssignment,
): IMemberTeamSeasonAssignment => ({
  ...assignment,
  enrolledAt: assignment.enrolledAt ? new Date(assignment.enrolledAt) : new Date(),
  suspendedAt: assignment.suspendedAt ? new Date(assignment.suspendedAt) : null,
  completedAt: assignment.completedAt ? new Date(assignment.completedAt) : null,
  withdrawnAt: assignment.withdrawnAt ? new Date(assignment.withdrawnAt) : null,
  createdAt: assignment.createdAt ? new Date(assignment.createdAt) : new Date(),
  updatedAt: assignment.updatedAt ? new Date(assignment.updatedAt) : new Date(),
});

export const getMemberTeamSeasonAssignments = async (
  params: GetAssignmentsParams,
): Promise<ServiceResponse<IMemberTeamSeasonAssignmentResponse>> => {
  return handleServerAction(async () => {
    const queryParams = new URLSearchParams();
    queryParams.set("teamSeasonId", params.teamSeasonId);
    if (params.page) queryParams.set("page", params.page);
    if (params.per_page) queryParams.set("per_page", params.per_page);
    if (params.status) queryParams.set("status", params.status);
    if (params.search) queryParams.set("search", params.search);

    const res = await api.get<IMemberTeamSeasonAssignmentResponse>(
      `/member-team-season-assignments?${queryParams.toString()}`,
      {
        next: {
          tags: ["member-assignments"],
          revalidate: 3600,
        },
      },
    );

    const data = (res.data || []).map(parseAssignment);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Asignaciones obtenidas exitosamente",
    };
  });
};

// Alias para compatibilidad con nomenclatura de páginas
export const getMembershipsForTeamSeason = getMemberTeamSeasonAssignments;

export const assignMemberToTeamSeason = async (
  payload: IAssignMemberPayload,
): Promise<ServiceResponse<IMemberTeamSeasonAssignment>> => {
  return handleServerAction(async () => {
    const res = await api.post<IMemberTeamSeasonAssignment>(
      "/member-team-season-assignments",
      payload,
    );

    const assignment = parseAssignment(res as unknown as IMemberTeamSeasonAssignment);

    return {
      error: false,
      data: assignment,
      message: "Miembro asignado exitosamente",
    };
  });
};

export const suspendMemberAssignment = async (
  assignmentId: string,
): Promise<ServiceResponse<IMemberTeamSeasonAssignment>> => {
  return handleServerAction(async () => {
    const res = await api.post<IMemberTeamSeasonAssignment>(
      `/member-team-season-assignments/${assignmentId}/suspend`,
      {},
    );

    const assignment = parseAssignment(res as unknown as IMemberTeamSeasonAssignment);

    return {
      error: false,
      data: assignment,
      message: "Asignación suspendida exitosamente",
    };
  });
};

export const reactivateMemberAssignment = async (
  assignmentId: string,
): Promise<ServiceResponse<IMemberTeamSeasonAssignment>> => {
  return handleServerAction(async () => {
    const res = await api.post<IMemberTeamSeasonAssignment>(
      `/member-team-season-assignments/${assignmentId}/reactivate`,
      {},
    );

    const assignment = parseAssignment(res as unknown as IMemberTeamSeasonAssignment);

    return {
      error: false,
      data: assignment,
      message: "Asignación reactivada exitosamente",
    };
  });
};

export const completeMemberAssignment = async (
  assignmentId: string,
): Promise<ServiceResponse<IMemberTeamSeasonAssignment>> => {
  return handleServerAction(async () => {
    const res = await api.post<IMemberTeamSeasonAssignment>(
      `/member-team-season-assignments/${assignmentId}/complete`,
      {},
    );

    const assignment = parseAssignment(res as unknown as IMemberTeamSeasonAssignment);

    return {
      error: false,
      data: assignment,
      message: "Asignación completada exitosamente",
    };
  });
};

export const withdrawMemberAssignment = async (
  assignmentId: string,
): Promise<ServiceResponse<IMemberTeamSeasonAssignment>> => {
  return handleServerAction(async () => {
    const res = await api.post<IMemberTeamSeasonAssignment>(
      `/member-team-season-assignments/${assignmentId}/withdraw`,
      {},
    );

    const assignment = parseAssignment(res as unknown as IMemberTeamSeasonAssignment);

    return {
      error: false,
      data: assignment,
      message: "Retiro procesado exitosamente",
    };
  });
};
