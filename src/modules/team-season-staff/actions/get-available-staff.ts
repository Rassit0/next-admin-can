"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IStaffOptionsResponse } from "@/modules/course-season-staff";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  teamSeasonId?: string;
}

export const getAvailableStaffOptions = async ({
  search,
  per_page = "10",
  page = "1",
  teamSeasonId,
}: SearchParams): Promise<ServiceResponse<IStaffOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (teamSeasonId) params.set("teamSeasonId", teamSeasonId);

    const res = await api.get<IStaffOptionsResponse>(
      `team-season-staff/available?${params.toString()}`,
      {
        next: {
          tags: ["staff", "team-season-staff"],
          revalidate: 60 * 60 * 24 * 7, // 1 semana
        },
      },
    );

    return {
      error: false,
      data: res,
      message:
        (res as any).message || "Personal disponible obtenido exitosamente",
    };
  });
};
