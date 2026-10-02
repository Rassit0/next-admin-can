"use server";
import { api } from "@/utils/api";
import { handleServerAction } from "@/utils";
import { IDisciplineOptionsResponse } from "@/modules/categories";
import { ISchoolOptionsResponse } from "@/modules/courses/interfaces/options.course.interface";

export interface IReportOption {
  id: string | number;
  name: string;
}

export async function getDisciplinesOptionsAction() {
  return handleServerAction(async () => {
    const res = await api.get<IDisciplineOptionsResponse>("schools/disciplines/options");
    return { error: false, data: res.data || [], message: "Success" };
  });
}

export async function getSchoolsOptionsAction(disciplineId: string) {
  return handleServerAction(async () => {
    const res = await api.get<ISchoolOptionsResponse>(`courses/schools-by-discipline/options/${disciplineId}`);
    return { error: false, data: res.data || [], message: "Success" };
  });
}

export async function getCourseSeasonsPaginatedAction(schoolId: string, page: number = 1) {
  return handleServerAction(async () => {
    const res = await api.get<any>(`course-seasons?schoolId=${schoolId}&page=${page}&per_page=15`);
    const items = (res.data || []).map((cs: any) => ({
      id: cs.id,
      name: `${cs.course?.name} - ${cs.season?.name}`,
    }));
    return {
      error: false,
      data: {
        items,
        nextPage: res.meta?.nextPage || null,
      },
      message: "Success"
    };
  });
}

export async function getCourseSeasonShiftsOptionsAction(courseSeasonId: string) {
  return handleServerAction(async () => {
    const res = await api.get<any>(`course-seasons/${courseSeasonId}/shifts`);
    return { error: false, data: Array.isArray(res) ? res : res.data || [], message: "Success" };
  });
}

export async function getCyclesOptionsAction(courseSeasonShiftId: string) {
  return handleServerAction(async () => {
    const res = await api.get<any>(`course-seasons/shifts/${courseSeasonShiftId}/cycles`);
    return { error: false, data: Array.isArray(res) ? res : res.data || [], message: "Success" };
  });
}
