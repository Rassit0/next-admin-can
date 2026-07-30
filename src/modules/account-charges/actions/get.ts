"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IAccountCharge, IAccountChargesResponse } from "../interfaces/charge.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  direction?: string;
  status?: string | string[];
  categoryId?: string;
  sortField?: string;
  orderBy?: string;
}

const parseAccountCharge = (charge: IAccountCharge): IAccountCharge => ({
  ...charge,
  createdAt: charge.createdAt ? new Date(charge.createdAt) : new Date(),
  updatedAt: charge.updatedAt ? new Date(charge.updatedAt) : new Date(),
});

export const getAccountCharges = async ({
  search,
  per_page = "10",
  page = "1",
  direction,
  status,
  categoryId,
  sortField,
  orderBy,
}: SearchParams): Promise<ServiceResponse<IAccountChargesResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (direction) params.set("direction", direction);
    if (status) {
      if (Array.isArray(status)) {
        status.forEach((s) => params.append("status", s));
      } else {
        params.set("status", status);
      }
    }
    if (categoryId) params.set("categoryId", categoryId);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<IAccountChargesResponse>(
      `account-charges?${params.toString()}`,
      {
        next: {
          tags: ["account-charges"],
          revalidate: 3600,
        },
      },
    );


    const data = (res.data ?? []).map(parseAccountCharge);

    return {
      error: false,
      data: { ...res, data } as IAccountChargesResponse,
      message: res.message || "Cargos obtenidos exitosamente",
    };
  });
};
