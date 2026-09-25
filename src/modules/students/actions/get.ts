"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { IStudentsResponse } from "@/modules/students";
import { handleServerAction } from "@/utils";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  orderBy?: string;
}

export const getStudents = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "name",
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<IStudentsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IStudentsResponse>(
      `students?${params.toString()}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        next: {
          tags: ["students"],
          revalidate: 3600,
        },
      },
    );

    const students = res.data.map((student) => ({
      ...student,
      person: {
        ...student.person,
        birthDate: student.person.birthDate
          ? new Date(student.person.birthDate)
          : null,
        createdAt: new Date(student.person.createdAt),
        updatedAt: new Date(student.person.updatedAt),
      },
    }));
    return {
      error: false,
      data: { ...res, data: students },
      message: "Jugadores obtenidos exitosamente",
    };
  });
};
