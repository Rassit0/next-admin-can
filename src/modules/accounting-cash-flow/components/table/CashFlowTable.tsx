"use client";
import { Chip, Table, Dropdown, Button, Label } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  MoreVerticalIcon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { SortableColumnHeader } from "@/ui";
import { ITransaction } from "../../interfaces/transaction.interface";
import React, { useState } from "react";
import { PrintReportDialog } from "@/modules/charge-transactions/components/dialog/PrintReportDialog";

interface Props {
  transactions: ITransaction[];
}

export const CashFlowTable = ({ transactions }: Props) => {
  const [printTransactionId, setPrintTransactionId] = useState<string | null>(
    null,
  );
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Historial de Flujo de Caja"
            className="min-w-200"
          >
            <Table.Header>
              <Table.Column allowsSorting id="transactionDate" isRowHeader>
                <SortableColumnHeader id="transactionDate">
                  Fecha
                </SortableColumnHeader>
              </Table.Column>
              <Table.Column id="receipt">
                <div className="font-semibold">Comprobante</div>
              </Table.Column>
              <Table.Column id="concept">
                <div className="font-semibold">Concepto</div>
              </Table.Column>
              <Table.Column id="category">
                <div className="font-semibold">Categoría</div>
              </Table.Column>
              <Table.Column allowsSorting id="type">
                <SortableColumnHeader id="type">Tipo</SortableColumnHeader>
              </Table.Column>
              <Table.Column id="paymentMethod">
                <div className="font-semibold">Método</div>
              </Table.Column>
              <Table.Column>Origen</Table.Column>
              <Table.Column>Cuenta Financiera</Table.Column>
              <Table.Column id="pagador">
                <div className="font-semibold">Pagador</div>
              </Table.Column>
              <Table.Column id="beneficiario">
                <div className="font-semibold">Beneficiario</div>
              </Table.Column>
              <Table.Column allowsSorting id="amount">
                <div className="text-right">
                  <SortableColumnHeader id="amount" className="justify-end">
                    Monto
                  </SortableColumnHeader>
                </div>
              </Table.Column>
              <Table.Column>Acciones</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100 text-default-500">
                    <HugeiconsIcon icon={Search01Icon} className="size-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-medium font-medium">
                      No se encontraron movimientos
                    </span>
                    <span className="text-sm text-default-400">
                      Aún no hay transacciones registradas en este periodo.
                    </span>
                  </div>
                </div>
              )}
            >
              {transactions.map((transaction) => (
                <Table.Row key={transaction.id} id={transaction.id}>
                  <Table.Cell>
                    <span
                      className="whitespace-nowrap text-default-600"
                      suppressHydrationWarning
                    >
                      {new Date(transaction.transactionDate).toLocaleString(
                        "es-BO",
                      )}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-sm text-default-700 whitespace-nowrap">
                      {transaction.receiptSeries && transaction.receiptNumber
                        ? `${transaction.receiptSeries}-${transaction.receiptNumber}`
                        : transaction.receiptNumber
                          ? `${transaction.receiptNumber}`
                          : "—"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium max-w-62.5 truncate block"
                      title={transaction.concept}
                    >
                      {transaction.concept}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {transaction.category ? (
                      <Chip size="sm" variant="soft">
                        {transaction.category}
                      </Chip>
                    ) : (
                      <span className="text-default-400">-</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={
                        transaction.type === "INCOME" ? "success" : "danger"
                      }
                    >
                      {transaction.type === "INCOME" ? "Ingreso" : "Egreso"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-default-600 text-sm">
                      {transaction.paymentMethod === "CASH"
                        ? "Efectivo"
                        : transaction.paymentMethod === "TRANSFER"
                          ? "Transferencia"
                          : "QR"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-default-500 text-xs">
                      {transaction.origin === "ACCOUNT_CHARGE"
                        ? "Administrativo"
                        : transaction.origin === "MEMBERSHIP"
                          ? "Membresía"
                          : transaction.origin === "STUDENT"
                            ? "Academia"
                            : transaction.origin === "BOOKING"
                              ? "Reserva"
                              : "General"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-default-700 text-sm">
                      {transaction.financialAccountName || (
                        <span className="text-default-400 italic">
                          Sin asignar
                        </span>
                      )}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm text-default-700 max-w-37.5 truncate">
                        {transaction.payerPerson ? (
                          `${transaction.payerPerson.name} ${transaction.payerPerson.lastName || ""}`
                        ) : (
                          <span className="text-default-400">—</span>
                        )}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm text-default-700 max-w-37.5 truncate">
                        {transaction.thirdParty ? (
                          transaction.thirdParty.name
                        ) : (
                          <span className="text-default-400">—</span>
                        )}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="text-right font-medium">
                      {transaction.type === "INCOME" ? "+" : "-"} Bs{" "}
                      {transaction.amount.toFixed(2)}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="relative flex justify-end items-center gap-2">
                      <Dropdown>
                        <Button
                          aria-label="Acciones"
                          isIconOnly
                          size="sm"
                          variant="ghost"
                        >
                          <HugeiconsIcon icon={MoreVerticalIcon} />
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu
                            aria-label="Acciones de Transacción"
                            onAction={(key) => {
                              if (key === "print") {
                                setPrintTransactionId(transaction.id);
                                setShowPrintDialog(true);
                              }
                            }}
                          >
                            <Dropdown.Item
                              id="print"
                              textValue="Imprimir Recibo"
                            >
                              <HugeiconsIcon icon={Invoice01Icon} />
                              <Label>Imprimir Recibo</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <PrintReportDialog
        transactionId={printTransactionId}
        isOpen={showPrintDialog}
        onOpenChange={setShowPrintDialog}
      />
    </>
  );
};
