"use server";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { api } from "@/utils/api";
import { auth } from "@/auth";

export interface IInstitutionContext {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export const getInstitutionContext = async (): Promise<ServiceResponse<IInstitutionContext>> => {
  const session = await auth();
  if (!session?.user?.token) return { error: true, statusCode: 401, message: "No autorizado", data: null };

  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IInstitutionContext }>(
      `institutions/context`,
      {
        headers: { Authorization: `Bearer ${session.user.token}` },
        next: { tags: ["institution-context"], revalidate: 3600 },
      }
    );
    return { error: false, data: res.data, message: res.message };
  });
};
