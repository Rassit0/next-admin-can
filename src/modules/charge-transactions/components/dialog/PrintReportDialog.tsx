"use client";

import { AlertDialog, Button, Spinner, toast } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Invoice01Icon,
  Download04Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";
import { useState, useCallback } from "react";
import { getTransactionReport } from "../../actions/get-transaction-report";

interface Props {
  transactionId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Componente reutilizable para descargar/imprimir el recibo PDF de una transacción.
 * Se puede usar desde cualquier lugar pasando el transactionId.
 */
export const PrintReportDialog = ({
  transactionId,
  isOpen,
  onOpenChange,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const openPdf = useCallback(
    async (action: "print" | "download") => {
      if (!transactionId) return;
      setIsLoading(true);

      try {
        const res = await getTransactionReport(transactionId);

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
          link.download = `recibo-${transactionId.slice(0, 8)}.pdf`;
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
    [transactionId, onOpenChange],
  );

  return (
    <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-sm">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="accent" />
            <AlertDialog.Heading>Recibo de Pago</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p className="text-sm text-muted">
              El pago se registró exitosamente. ¿Qué deseas hacer con el recibo?
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
