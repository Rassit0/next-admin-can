"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";
import { ICreateCompanyForm } from "../schemas/create-company.schema";
import { ICompanyOption } from "../interfaces/company.interface";

export const createCompanyAction = async (
  data: ICreateCompanyForm,
): Promise<ServiceResponse<ICompanyOption>> => {
  return handleServerAction(async () => {
    const res = await api.post<ICompanyOption>("companies", data);
    updateTag("companies");
    return {
      data: res,
      error: false,
      message: "Empresa/Entidad creada correctamente",
    };
  });
};
