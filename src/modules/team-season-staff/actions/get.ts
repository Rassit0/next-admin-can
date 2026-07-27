"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ITeamSeasonStaffResponse } from "../interfaces/staff.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  orderBy?: string;
  teamSeasonId?: string;
  role?: string;
}

export const getTeamSeasonStaff = async ({
  search,
  per_page = "10",
  page = "1",
  orderBy = "asc",
  teamSeasonId,
  role,
}: SearchParams): Promise<ServiceResponse<ITeamSeasonStaffResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (orderBy) params.set("orderBy", orderBy);
    if (teamSeasonId) params.set("teamSeasonId", teamSeasonId);
    if (role) params.set("role", role);

    const res = await api.get<ITeamSeasonStaffResponse>(
      `team-season-staff?${params.toString()}`,
      {
        next: {
          tags: ["team-season-staff"],
        },
      },
    );

    return {
      error: false,
      data: res,
      message:
        (res as any).message || "Personal del equipo obtenido exitosamente",
    };
  });
};
