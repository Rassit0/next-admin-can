"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";

export interface IStudentReenterShift {
  id: string;
  name: string;
  categoryName: string;
  gender: string;
  maxMembers: number;
  currentMembers: number;
  availableSpots: number;
  isCurrentShift: boolean;
}

export interface IStudentReenterCycle {
  id: string;
  cycleStartDate: string;
  cycleEndDate: string;
  status: string;
  attempt: number;
  chargeStatus: string | null;
  chargeAmount: number | null;
}

export interface IStudentReenterContext {
  membershipId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  reenteredAt: string | null;
  withdrawalDate: string | null;
  withdrawalReason: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    documentNumber: string | null;
    birthDate: string | null;
  };
  courseSeason: {
    id: string;
    courseName: string;
    seasonName: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  currentShift: {
    id: string;
    name: string;
  };
  availableShifts: IStudentReenterShift[];
  cyclesSummary: {
    total: number;
    confirmed: number;
    cancelled: number;
    pending: number;
    recentCycles: IStudentReenterCycle[];
  };
}

export const getStudentReentryContext = async (
  membershipId: string,
): Promise<ServiceResponse<IStudentReenterContext>> => {
  return handleServerAction(async () => {
    const response = await api.get<IStudentReenterContext>(
      `student-memberships/reenter-context/${membershipId}`,
    );

    return {
      error: false,
      data: response,
      message: "Contexto de reingreso cargado exitosamente",
    };
  });
};
