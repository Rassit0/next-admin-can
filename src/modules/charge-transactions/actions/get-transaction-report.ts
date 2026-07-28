"use server";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { api } from "@/utils/api";

/**
 * Obtiene el reporte PDF de una transacción desde el backend.
 * Usa api.getBlob() para manejar la respuesta binaria del PDF.
 */
export const getTransactionReport = async (
  transactionId: string,
): Promise<ServiceResponse<string>> => {
  return handleServerAction(async () => {
    const blob = await api.getBlob(
      `transaction-report/transaction/${transactionId}`,
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
