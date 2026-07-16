import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISchool } from "../interfaces/school.interface";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getSchoolById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ISchool>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: ISchool }>(`schools/${id}`, {
      next: {
        tags: ["schools"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "School obtenido exitosamente",
    };
  });
};
