"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IOrganizationsResponse } from "../interfaces/organization.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  callbackUrl?: string;
}

export const getInstitutions = async ({
  search,
  per_page = "5",
  page = "1",
}: SearchParams): Promise<ServiceResponse<IOrganizationsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    const res = await api.get<IOrganizationsResponse>(
      `institutions?${params.toString()}`,
      {
        next: {
          tags: ["institutions"],
          revalidate: 3600,
        },
      },
    );

    const data = res.data.map((organization) => ({
      ...organization,
      createdAt: new Date(organization.createdAt),
      updatedAt: new Date(organization.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Instituciones obtenidas exitosamente",
    };
  });
};
