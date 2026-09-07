"use server";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { api } from "@/utils/api";

/**
 * Obtiene el reporte PDF consolidado de múltiples pagos desde el backend.
 * Usa api.postBlob() para manejar la respuesta binaria del PDF.
 */
export const getBulkTransactionReport = async (
  paymentIds: string[],
): Promise<ServiceResponse<string>> => {
  return handleServerAction(async () => {
    const blob = await api.postBlob(
      `payment-report/bulk`,
      { paymentIds }
    );

    const arrayBuffer = await blob.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      error: false,
      data: pdfBase64,
      message: "Reporte consolidado generado exitosamente",
    };
  });
};
