"use client";

import { AlertDialog, Button, Spinner, toast } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Invoice01Icon,
  Download04Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";
import { useState, useCallback } from "react";
import {
  getTransactionReport,
  getTransactionReportSingle,
} from "@/modules/charge-transactions";
import { getBulkTransactionReport } from "@/modules/charge-transactions/actions/get-bulk-transaction-report";

interface Props {
  transactionId?: string | null;
  paymentIds?: string[];
  reportType?: "payment" | "transaction";
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Componente reutilizable para descargar/imprimir el recibo PDF de un pago o transacción.
 * Se puede usar desde cualquier lugar pasando el transactionId y el tipo de reporte.
 */
export const PrintReportDialog = ({
  transactionId,
  paymentIds,
  reportType = "transaction",
  isOpen,
  onOpenChange,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const openPdf = useCallback(
    async (action: "print" | "download") => {
      if (!transactionId && (!paymentIds || paymentIds.length === 0)) {
        toast.danger("No hay pagos seleccionados o el ID es inválido.");
        return;
      }
      setIsLoading(true);

      try {
        let res;

        if (paymentIds && paymentIds.length > 0) {
          res = await getBulkTransactionReport(paymentIds);
        } else if (transactionId) {
          if (action === "print") {
            res = await getTransactionReport(transactionId, reportType);
          } else {
            res = await getTransactionReportSingle(transactionId, reportType);
          }
        } else {
          return;
        }

        if (res.error || !res.data) {
          toast.danger(res.message || "Error al generar el reporte.");
          return;
        }

        const byteCharacters = atob(res.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        if (action === "print") {
          const printWindow = window.open(url);
          if (printWindow) {
            printWindow.addEventListener("load", () => {
              printWindow.print();
            });
          }
        } else {
          const link = document.createElement("a");
          link.href = url;
          const fileName =
            paymentIds && paymentIds.length > 0
              ? `recibos-multiples.pdf`
              : `recibo-${transactionId?.slice(0, 8) || "pago"}.pdf`;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Limpiar el blob URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        onOpenChange(false);
      } catch (error) {
        toast.danger("Ocurrió un error al generar el recibo.");
      } finally {
        setIsLoading(false);
        onSuccess?.();
      }
    },
    [transactionId, paymentIds, onOpenChange, reportType, onSuccess],
  );

  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Container>
        <AlertDialog.Dialog
          className="sm:max-w-sm"
          aria-label={
            paymentIds && paymentIds.length > 0
              ? "Imprimir Recibo Múltiple"
              : "Imprimir Recibo de Pago"
          }
        >
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="accent" />
            <AlertDialog.Heading>
              {paymentIds && paymentIds.length > 0
                ? "Recibo Múltiple"
                : "Recibo de Pago"}
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p className="text-sm text-muted">
              {paymentIds && paymentIds.length > 0
                ? "Los pagos se registraron exitosamente. ¿Qué deseas hacer con el recibo múltiple consolidado?"
                : "El pago se registró exitosamente. ¿Qué deseas hacer con el recibo?"}
            </p>
          </AlertDialog.Body>
          <AlertDialog.Footer className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="tertiary"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cerrar
            </Button>
            <Button
              variant="secondary"
              onPress={() => openPdf("download")}
              isDisabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Spinner color="current" size="sm" />
              ) : (
                <HugeiconsIcon icon={Download04Icon} size={18} />
              )}
              Descargar PDF
            </Button>
            <Button
              variant="primary"
              onPress={() => openPdf("print")}
              isDisabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Spinner color="current" size="sm" />
              ) : (
                <HugeiconsIcon icon={PrinterIcon} size={18} />
              )}
              Imprimir
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
