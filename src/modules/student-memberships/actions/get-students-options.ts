"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IStudentsOptionsResponse } from "@/modules/student-memberships";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  orderBy?: string;
}

export const getStudentsOptions = async (
  { search, per_page = "10", page = "1", orderBy = "asc" }: SearchParams
): Promise<ServiceResponse<IStudentsOptionsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IStudentsOptionsResponse>(
      `student-memberships/students-options?${params.toString()}`,
      {
        next: {
          tags: ["students", "persons"],
          revalidate: 60 * 60 * 24 * 7, //1 semana
        },
      },
    );

    return {
      error: false,
      data: {
        ...res,
        data: res.data.map((student) => ({
          ...student,
          person: {
            ...student.person,
            birthDate: new Date(student.person.birthDate),
          },
        })),
      },
      message: res.message || "Jugadores obtenidos exitosamente",
    };
  });
};
