"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPreviewChargesResponse } from "@/modules/player-memberships";

export interface PreviewAdvanceChargesData {
  quantity: number;
}

export const previewAdvanceCharges = async (
  membershipId: string,
  data: PreviewAdvanceChargesData,
): Promise<ServiceResponse<IPreviewChargesResponse["data"]>> => {
  return handleServerAction(async () => {
    const response = await api.post<IPreviewChargesResponse>(
      `student-charges/advance/${membershipId}/preview`,
      data,
    );

    return {
      error: false,
      data: response.data,
      message: response.message || "Cargos previsualizados exitosamente",
    };
  });
};
