"use client";
import { Chip, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { SortableColumnHeader } from "@/ui";
import { ICharge } from "@/modules/charges";

interface Props {
  charges: ICharge[];
}

const formatCurrency = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
  }).format(value);
};

export const TableCharges = ({ charges }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PARTIAL":
        return "warning";
      case "PENDING":
        return "danger";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pagado";
      case "PARTIAL":
        return "Parcial";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Cargos de la membresía"
          className="min-w-200"
        >
          <Table.Header className="bg-surface-secondary">
            <Table.Column allowsSorting id="description">
              <SortableColumnHeader id="description">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Concepto
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="amount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Monto
              </span>
            </Table.Column>
            <Table.Column id="pendingAmount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Pendiente
              </span>
            </Table.Column>
            <Table.Column allowsSorting id="dueDate">
              <SortableColumnHeader id="dueDate">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Vencimiento
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Estado
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Acciones
              </span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-10 text-center text-sm text-muted">
                No hay cargos registrados.
              </div>
            )}
          >
            {charges.map((charge) => {
              return (
                <Table.Row
                  key={charge.id}
                  id={charge.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                >
                  <Table.Cell className="py-3">
                    <span className="font-medium text-foreground">
                      {charge.description}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-medium">
                      {formatCurrency(charge.amount)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-semibold tabular-nums text-accent">
                      {formatCurrency(charge.pendingAmount)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-sm">
                    {new Date(charge.dueDate).toLocaleDateString("es-BO")}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <Chip
                      color={getStatusColor(charge.status)}
                      variant="soft"
                      size="sm"
                      className="font-medium"
                    >
                      {getStatusLabel(charge.status)}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex items-center justify-center">
                      <span className="text-xs text-muted">—</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
