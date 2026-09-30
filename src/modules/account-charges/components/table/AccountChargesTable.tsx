"use client";
import { Button, Chip, Table } from "@heroui/react";
import {
  Copy01Icon,
  Search01Icon,
  ViewIcon,
  Edit02Icon,
  Delete01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader } from "@/ui";
import { TableActions } from "@/ui/components/table-actions/TableActions";
import { IAccountCharge } from "../../interfaces/charge.interface";
import Link from "next/link";
import { formatCurrency } from "@/utils";

interface Props {
  accountCharges: IAccountCharge[];
  direction?: "RECEIVABLE" | "PAYABLE";
  onEdit?: (charge: IAccountCharge) => void;
  onCancel?: (charge: IAccountCharge) => void;
  onPay?: (charge: IAccountCharge) => void;
}

export const AccountChargesTable = ({
  accountCharges,
  direction,
  onEdit,
  onCancel,
  onPay,
}: Props) => {
  const statusMap: Record<
    string,
    {
      label: string;
      color: "default" | "accent" | "success" | "warning" | "danger";
    }
  > = {
    PENDING: { label: "Pendiente", color: "warning" },
    PARTIAL: { label: "Parcial", color: "accent" },
    PAID: { label: "Pagado", color: "success" },
    CANCELLED: { label: "Anulado", color: "danger" },
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Cuentas" className="min-w-200">
          <Table.Header>
            <Table.Column
              allowsSorting
              isRowHeader
              className="after:hidden"
              id="id"
            >
              <SortableColumnHeader id="id">N° Ref.</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="title">
              <SortableColumnHeader id="title">Concepto</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="category">
              <SortableColumnHeader id="category">
                Categorí­a
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="entity">
              <SortableColumnHeader id="entity">
                Entidad / Persona
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="dueDate">
              <SortableColumnHeader id="dueDate">
                Vencimiento
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="amount">
              <SortableColumnHeader id="amount">Monto</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="pendingAmount">
              <SortableColumnHeader id="pendingAmount">
                Restante
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">ESTADO</SortableColumnHeader>
            </Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100 text-default-500">
                  <HugeiconsIcon icon={Search01Icon} className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-medium font-medium">
                    No se encontraron registros
                  </span>
                  <span className="text-sm text-default-400">
                    Intenta con otros términos de búsqueda o registra una nueva
                    cuenta.
                  </span>
                </div>
              </div>
            )}
          >
            {accountCharges.map((accountCharge) => {
              const statusData =
                statusMap[accountCharge.charge?.status || "PENDING"];
              return (
                <Table.Row key={accountCharge.id} id={accountCharge.id}>
                  <Table.Cell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-default-500 text-xs">
                        {accountCharge.referenceNumber ||
                          accountCharge.id.slice(0, 8)}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="font-medium">{accountCharge.title}</div>
                    {accountCharge.description && (
                      <div className="text-xs text-default-500 max-w-50 truncate">
                        {accountCharge.description}
                      </div>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <Chip size="sm" variant="soft">
                      {accountCharge.category?.name || "-"}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    {accountCharge.person ? (
                      <span>
                        {accountCharge.person.name}{" "}
                        {accountCharge.person.lastName}
                      </span>
                    ) : (
                      <span>{accountCharge.externalEntity || "-"}</span>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    {accountCharge.charge?.dueDate
                      ? new Date(
                          accountCharge.charge.dueDate,
                        ).toLocaleDateString()
                      : "-"}
                  </Table.Cell>

                  <Table.Cell className="font-medium">
                    {formatCurrency(Number(accountCharge.charge?.amount) || 0)}
                  </Table.Cell>

                  <Table.Cell className="font-semibold">
                    {formatCurrency(
                      Number(accountCharge.charge?.pendingAmount) || 0,
                    )}
                  </Table.Cell>

                  <Table.Cell className="min-w-25">
                    <Chip size="sm" variant="soft" color={statusData.color}>
                      {statusData.label}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex justify-center w-full">
                      <TableActions
                        actions={[
                          {
                            key: "view",
                            label: "Ver Detalles",
                            icon: ViewIcon,
                            href: `/admin/accounting/charges/${accountCharge.id}`,
                          },
                          ...(onPay &&
                          accountCharge.charge?.status !== "PAID" &&
                          accountCharge.charge?.status !== "CANCELLED"
                            ? [
                                {
                                  key: "pay",
                                  label: "Registrar Pago",
                                  icon: Wallet01Icon,
                                  onPress: () => onPay(accountCharge),
                                },
                              ]
                            : []),
                          ...(onEdit &&
                          accountCharge.charge?.status !== "PAID" &&
                          accountCharge.charge?.status !== "CANCELLED"
                            ? [
                                {
                                  key: "edit",
                                  label: "Editar",
                                  icon: Edit02Icon,
                                  onPress: () => onEdit(accountCharge),
                                },
                              ]
                            : []),
                          ...(onCancel &&
                          accountCharge.charge?.status !== "CANCELLED"
                            ? [
                                {
                                  key: "cancel",
                                  label: "Anular",
                                  icon: Delete01Icon,
                                  danger: true,
                                  onPress: () => onCancel(accountCharge),
                                },
                              ]
                            : []),
                        ]}
                      />
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
