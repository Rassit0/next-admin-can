"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { IStudent } from "@/modules/students";
import { handleServerAction } from "@/utils";

interface SearchParams {
  id: string;
}

export const getStudentById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IStudent>> => {
  return handleServerAction(async () => {
    console.log("entro", id);
    const res = await api.get<{ data: IStudent; message: string }>(
      `students/${id}`, // 1er argumento: el endpoint
      {
        // 2do argumento: options (aquí va el caché)
        // next: {
        //   tags: ["students"],
        //   revalidate: 3600,
        // },
      },
    );
    console.log(res.data);

    const student: IStudent = {
      ...res.data,
      person: {
        ...res.data.person,
        birthDate: res.data.person.birthDate
          ? new Date(res.data.person.birthDate)
          : null,
        createdAt: new Date(res.data.person.createdAt),
        updatedAt: new Date(res.data.person.updatedAt),
      },
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };
    return {
      error: false,
      data: student,
      message: res.message || "Jugador obtenido exitosamente",
    };
  });
};
