"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { AuthData, IAuthResponse } from "@/modules/auth";

export const login = async (data: {
  email: string;
  password: string;
}): Promise<ServiceResponse<AuthData>> => {
  return handleServerAction(async () => {
    const response = await api.post<IAuthResponse>(`auth/login`, data);

    updateTag("login");
    return {
      error: false,
      data: response.data,
      message: response.message || "Login exitoso",
    };
  }, undefined, true);
};
