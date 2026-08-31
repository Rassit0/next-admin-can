"use server";

import { api } from "../../../utils/api";
import { ServiceResponse } from "../../../types/api";
import { handleServerAction } from "../../../utils";
import { revalidatePath } from "next/cache";
import { ITeamSeasonCategory, IPostTeamSeasonCategory, IUpdateTeamSeasonCategory } from "../../../modules/team-seasons";

export const addTeamSeasonCategory = async (
  teamSeasonId: string,
  payload: IPostTeamSeasonCategory
): Promise<ServiceResponse<ITeamSeasonCategory>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: ITeamSeasonCategory }>(
      `team-seasons/${teamSeasonId}/categories`,
      payload
    );

    revalidatePath(`/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/${teamSeasonId}`);
    return { error: false as const, data: res.data, message: res.message };
  });
};

export const updateTeamSeasonCategory = async (
  teamSeasonId: string,
  categoryId: string,
  payload: IUpdateTeamSeasonCategory
): Promise<ServiceResponse<ITeamSeasonCategory>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: ITeamSeasonCategory }>(
      `team-seasons/${teamSeasonId}/categories/${categoryId}`,
      payload
    );

    revalidatePath(`/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/${teamSeasonId}`);
    return { error: false as const, data: res.data, message: res.message };
  });
};

export const activateTeamSeasonCategory = async (
  teamSeasonId: string,
  categoryId: string
): Promise<ServiceResponse<ITeamSeasonCategory>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: ITeamSeasonCategory }>(
      `team-seasons/${teamSeasonId}/categories/${categoryId}/activate`,
      {}
    );

    revalidatePath(`/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/${teamSeasonId}`);
    return { error: false as const, data: res.data, message: res.message };
  });
};

export const deactivateTeamSeasonCategory = async (
  teamSeasonId: string,
  categoryId: string
): Promise<ServiceResponse<ITeamSeasonCategory>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: ITeamSeasonCategory }>(
      `team-seasons/${teamSeasonId}/categories/${categoryId}/deactivate`,
      {}
    );

    revalidatePath(`/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/${teamSeasonId}`);
    return { error: false as const, data: res.data, message: res.message };
  });
};

export const getTeamSeasonCategories = async (
  teamSeasonId: string
): Promise<ServiceResponse<ITeamSeasonCategory[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ITeamSeasonCategory[] }>(
      `team-seasons/${teamSeasonId}/categories`,
      {
        next: {
          tags: ["team-seasons"],
          revalidate: 0,
        },
      }
    );

    return { error: false as const, data: res.data, message: res.message };
  });
};

export const finalizeTeamSeasonCategory = async (
  teamSeasonId: string,
  categoryId: string,
  notes: string
): Promise<ServiceResponse<ITeamSeasonCategory>> => {
  return handleServerAction(async () => {
    const res = await api.post<{ message: string; data: ITeamSeasonCategory }>(
      `team-seasons/${teamSeasonId}/categories/${categoryId}/finish-early`,
      { notes }
    );

    // Usa updateTag como prefiere el usuario
    const { updateTag } = await import("next/cache");
    updateTag("team-seasons");
    return { error: false as const, data: res.data, message: res.message };
  });
};

