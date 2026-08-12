"use server";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { api } from "@/utils/api";

/**
 * Obtiene el reporte PDF de un pago o transacción desde el backend.
 * Usa api.getBlob() para manejar la respuesta binaria del PDF.
 */
export const getTransactionReport = async (
  id: string,
  type: "payment" | "transaction" = "transaction",
): Promise<ServiceResponse<string>> => {
  return handleServerAction(async () => {
    const blob = await api.getBlob(
      `payment-report/${type}/${id}`,
    );

    const arrayBuffer = await blob.arrayBuffer();
    const pdfBase64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      error: false,
      data: pdfBase64,
      message: "Reporte generado exitosamente",
    };
  });
};
