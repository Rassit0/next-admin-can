"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IStaffResponse } from "../interfaces";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: string;
  orderBy?: string;
}

export const getStaff = async ({
  search,
  per_page = "10",
  page = "1",
  sortField = "name",
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<IStaffResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IStaffResponse>(`staff?${params.toString()}`, {
      next: {
        tags: ["staff", "persons"],
        revalidate: 60 * 60,
      },
    });

    return {
      error: false,
      data: {
        ...res,
        data: res.data.map((staff) => ({
          ...staff,
          person: {
            ...staff.person,
            birthDate: new Date(staff.person.birthDate),
          },
        })),
      },
      message: res.message || "Personal obtenido exitosamente",
    };
  });
};
