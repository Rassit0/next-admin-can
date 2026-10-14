"use client";

import { useState } from "react";
import { InternalTransfer } from "../interfaces/internal-transfer.interface";
import { FinancialAccount } from "../../financial-accounts/interfaces/financial-account.interface";
import { InternalTransferDrawer } from "./InternalTransferDrawer";
import { Table, Button, Card, Chip, AlertDialog } from "@heroui/react";
import { toast } from "sonner";
import { cancelInternalTransfer } from "../actions/cancel";
import { Add01Icon, Cancel01Icon, Download01Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { TableActions, ActionDef } from "@/ui";

interface Props {
  transfers: InternalTransfer[];
  accounts: FinancialAccount[];
}

export const InternalTransfersClient = ({ transfers, accounts }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transferToCancel, setTransferToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleConfirmCancel = async () => {
    if (!transferToCancel || isCancelling) return;

    setIsCancelling(true);
    try {
      const response = await cancelInternalTransfer(transferToCancel);
      if (response.error) {
        toast.error(response.message || "Error al anular");
        return;
      }
      toast.success(response.message || "Transferencia anulada exitosamente");
      setTransferToCancel(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al anular");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const { downloadInternalTransferReceipt } = await import("../actions/download-receipt");
      const result = await downloadInternalTransferReceipt(id);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Recibo no disponible para esta transferencia histórica.");
      }

      const base64Part = result.url.split(",")[1];
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      toast.success("Recibo generado exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al descargar");
    }
  };

  const statusColorMap: Record<
    string,
    "success" | "warning" | "danger" | "default" | "accent"
  > = {
    COMPLETED: "success",
    PENDING: "warning",
    CANCELLED: "danger",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transferencias Internas</h1>
          <p className="text-default-500">
            Gestiona los movimientos de dinero entre tus propias cuentas
          </p>
        </div>
        <Button onPress={() => setIsOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          Nueva Transferencia
        </Button>
      </div>

      <Card>
        <Table aria-label="Tabla de transferencias internas">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Tabla de transferencias internas"
              className="w-full"
            >
              <Table.Header>
                <Table.Column isRowHeader>FECHA</Table.Column>
                <Table.Column>ORIGEN</Table.Column>
                <Table.Column>DESTINO</Table.Column>
                <Table.Column>MONTO</Table.Column>
                <Table.Column>REFERENCIA / NOTA</Table.Column>
                <Table.Column>ESTADO</Table.Column>
                <Table.Column className="text-center">ACCIONES</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center p-8">
                    <span className="text-sm text-muted-foreground">
                      No hay transferencias registradas
                    </span>
                  </div>
                )}
              >
                {transfers.map((transfer) => {
                  const canDownloadReceipt = transfer.status === "COMPLETED";
                  const canCancel =
                    transfer.status === "COMPLETED" ||
                    transfer.status === "PENDING";

                  const rowActions: ActionDef[] = [];

                  if (canDownloadReceipt) {
                    rowActions.push({
                      key: "download",
                      label: "Descargar Recibo",
                      icon: Download01Icon,
                      onPress: () => handleDownload(transfer.id),
                    });
                  }

                  if (canCancel) {
                    rowActions.push({
                      key: "cancel",
                      label: "Anular Transferencia",
                      icon: Cancel01Icon,
                      danger: true,
                      onPress: () => setTransferToCancel(transfer.id),
                    });
                  }

                  return (
                    <Table.Row key={transfer.id}>
                      <Table.Cell>
                        {new Intl.DateTimeFormat("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(transfer.date))}
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-danger font-medium">
                          {transfer.sourceTransaction?.financialAccount?.name ||
                            "Desconocido"}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-success font-medium">
                          {transfer.destinationTransaction?.financialAccount
                            ?.name || "Desconocido"}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-bold">
                          Bs. {Number(transfer.amount).toFixed(2)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="text-small">
                            {transfer.description || "-"}
                          </span>
                          <span className="text-tiny text-default-400">
                            Ref: {transfer.reference || "N/A"}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip color={statusColorMap[transfer.status]}>
                          {transfer.status === "COMPLETED"
                            ? "COMPLETADO"
                            : transfer.status === "PENDING"
                              ? "PENDIENTE"
                              : "ANULADO"}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex justify-center items-center">
                          {rowActions.length > 0 ? (
                            <TableActions
                              mode="dropdown"
                              actions={rowActions}
                            />
                          ) : (
                            <span className="text-default-400 text-xs italic">—</span>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card>

      <InternalTransferDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        accounts={accounts}
      />

      <AlertDialog.Backdrop
        isOpen={!!transferToCancel}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setTransferToCancel(null);
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-md">
            <AlertDialog.Header>
              <AlertDialog.Icon className="bg-danger/10 text-danger">
                <HugeiconsIcon icon={Alert02Icon} />
              </AlertDialog.Icon>
              <AlertDialog.Heading>
                Anular Transferencia Interna
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-default-500 text-sm">
                ¿Está seguro de anular esta transferencia? Esto revertirá los saldos en ambas cuentas financieras y no se podrá deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                onPress={() => setTransferToCancel(null)}
                isDisabled={isCancelling}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={handleConfirmCancel}
                isPending={isCancelling}
              >
                Confirmar Anulación
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
};
