"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { revalidatePath } from "next/cache";

export interface GenerateAdvanceChargesData {
  quantity: number;
}

export const generateAdvanceCharges = async (
  membershipId: string,
  data: GenerateAdvanceChargesData,
): Promise<ServiceResponse<any>> => {
  return handleServerAction(async () => {
    const response = await api.post<any>(
      `student-charges/advance/${membershipId}/generate`,
      data,
    );

    revalidatePath(`/admin/student-memberships/${membershipId}/charges`);

    return {
      error: false,
      data: response.data,
      message: response.message || "Cargos generados exitosamente",
    };
  });
};
