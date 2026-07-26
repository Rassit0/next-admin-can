"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { ITeamSeasonStaff } from "@/modules/team-season-staff";

export interface AddTeamSeasonStaffData {
  teamSeasonId: string;
  staffId: string;
  role: string;
  customRole?: string | null;
  startedAt: string;
  endedAt?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
}

export const addTeamSeasonStaff = async (
  data: AddTeamSeasonStaffData,
): Promise<ServiceResponse<ITeamSeasonStaff>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: ITeamSeasonStaff;
    }>(`team-season-staff`, data);

    updateTag("team-season-staff");
    return {
      error: false,
      data: response.data,
      message: response.message || "Personal asignado exitosamente",
    };
  });
};
