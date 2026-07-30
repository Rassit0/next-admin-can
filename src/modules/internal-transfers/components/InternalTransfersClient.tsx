"use client";

import { useState } from "react";
import { InternalTransfer } from "../interfaces/internal-transfer.interface";
import { FinancialAccount } from "../../financial-accounts/interfaces/financial-account.interface";
import { InternalTransferDrawer } from "./InternalTransferDrawer";
import {
  Table,
  Button,
  Card,
  Chip,
} from "@heroui/react";
import { toast } from "sonner";
import { cancelInternalTransfer } from "../actions/cancel";
import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  transfers: InternalTransfer[];
  accounts: FinancialAccount[];
}

export const InternalTransfersClient = ({ transfers, accounts }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  const handleCancel = async (id: string) => {
    if (!confirm("¿Está seguro de anular esta transferencia? Esto revertirá los saldos de ambas cuentas.")) {
      return;
    }

    setCancellingId(id);
    try {
      const response = await cancelInternalTransfer(id);
      if (response.error) {
        toast.error(response.message || "Error al anular");
        return;
      }
      toast.success(response.message || "Transferencia anulada exitosamente");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al anular");
    } finally {
      setCancellingId(null);
    }
  };

  const statusColorMap: Record<string, "success" | "warning" | "danger" | "default" | "accent"> = {
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
            <Table.Content aria-label="Tabla de transferencias internas" className="w-full">
              <Table.Header>
                <Table.Column>FECHA</Table.Column>
                <Table.Column>ORIGEN</Table.Column>
                <Table.Column>DESTINO</Table.Column>
                <Table.Column>MONTO</Table.Column>
                <Table.Column>REFERENCIA / NOTA</Table.Column>
                <Table.Column>ESTADO</Table.Column>
                <Table.Column>ACCIONES</Table.Column>
              </Table.Header>
              <Table.Body
                renderEmptyState={() => (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center p-8">
                    <span className="text-sm text-muted-foreground">No hay transferencias registradas</span>
                  </div>
                )}
              >
            {transfers.map((transfer) => (
              <Table.Row key={transfer.id}>
                <Table.Cell>
                  {new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(transfer.date))}
                </Table.Cell>
                <Table.Cell>
                  <span className="text-danger font-medium">
                    {transfer.sourceTransaction?.financialAccount?.name || "Desconocido"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-success font-medium">
                    {transfer.destinationTransaction?.financialAccount?.name || "Desconocido"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-bold">
                    Bs. {Number(transfer.amount).toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="text-small">{transfer.description || "-"}</span>
                    <span className="text-tiny text-default-400">Ref: {transfer.reference || "N/A"}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Chip color={statusColorMap[transfer.status]}>
                    {transfer.status === "COMPLETED" ? "COMPLETADO" : transfer.status === "PENDING" ? "PENDIENTE" : "ANULADO"}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center">
                    <Button
                      variant="danger"
                      isDisabled={transfer.status === "CANCELLED"}
                      onPress={() => handleCancel(transfer.id)}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                      {cancellingId === transfer.id && "Anulando..."}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
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
    </div>
  );
};
