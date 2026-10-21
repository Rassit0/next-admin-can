"use client";
import {
  Chip,
  Table,
  Dropdown,
  Button,
  Label,
  AlertDialog,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  MoreVerticalIcon,
  Invoice01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { SortableColumnHeader } from "@/ui";
import { ITransaction } from "../../interfaces/transaction.interface";
import React, { useState } from "react";
import { PrintReportDialog } from "@/modules/charge-transactions/components/dialog/PrintReportDialog";
import { toast } from "sonner";
import { deleteTransaction } from "../../actions/delete-transaction";

interface Props {
  transactions: ITransaction[];
}

const getMethodConfig = (method?: string | null) => {
  if (!method) return { label: "Sin método", color: "default" as const };
  switch (method.toUpperCase()) {
    case "CASH":
      return { label: "Efectivo", color: "success" as const };
    case "QR":
      return { label: "QR", color: "accent" as const };
    case "TRANSFER":
      return { label: "Transferencia", color: "default" as const };
    case "CARD":
      return { label: "Tarjeta", color: "warning" as const };
    case "DEPOSIT":
      return { label: "Depósito", color: "accent" as const };
    default:
      return { label: method, color: "default" as const };
  }
};

interface PaymentMethodCellProps {
  transaction: ITransaction;
}

const PaymentMethodCell = ({ transaction }: PaymentMethodCellProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (transaction.kind === "INTERNAL_TRANSFER") {
    return (
      <div className="flex flex-col gap-0.5 min-w-36">
        <div className="flex items-center gap-1.5 font-medium">
          <Chip size="sm" variant="soft" color="accent" className="text-[11px] h-5 px-1.5 font-semibold">
            Transferencia
          </Chip>
          <span className="font-mono text-xs text-default-700">Bs {transaction.amount.toFixed(2)}</span>
        </div>
        <span className="text-[11px] text-default-400">Entre cuentas</span>
      </div>
    );
  }

  const breakdown = transaction.paymentBreakdown && transaction.paymentBreakdown.length > 0
    ? transaction.paymentBreakdown
    : (transaction.groupedDetails && transaction.groupedDetails.length > 0
      ? transaction.groupedDetails.map(d => ({
          method: d.method,
          accountName: d.account,
          accountId: d.accountId,
          amount: d.amount,
          status: d.status
        }))
      : []);

  // Single method operation or transaction fallback
  if (transaction.kind !== "PAYMENT" || breakdown.length <= 1) {
    const method = breakdown.length === 1 ? breakdown[0].method : transaction.paymentMethod;
    const account = breakdown.length === 1 ? breakdown[0].accountName : transaction.accountName;
    const amount = breakdown.length === 1 ? breakdown[0].amount : transaction.amount;
    const config = getMethodConfig(method);

    return (
      <div className="flex flex-col gap-0.5 min-w-36">
        <div className="flex items-center gap-1.5 font-medium">
          <Chip size="sm" variant="soft" color={config.color} className="text-[11px] h-5 px-1.5 font-semibold">
            {config.label}
          </Chip>
          <span className="font-mono text-xs text-default-700">Bs {amount.toFixed(2)}</span>
        </div>
        <span className="text-[11px] text-default-500 truncate max-w-44" title={account || ""}>
          Cuenta: {account || "Sin asignar"}
        </span>
      </div>
    );
  }

  // Combined/split payment with multiple components
  const displayItems = isExpanded ? breakdown : breakdown.slice(0, 2);
  const hasMore = breakdown.length > 2;

  return (
    <div className="flex flex-col gap-1.5 min-w-44 py-0.5">
      {displayItems.map((item, idx) => {
        const config = getMethodConfig(item.method);
        return (
          <div key={idx} className="flex flex-col gap-0.5 border-l-2 border-primary-300 dark:border-primary-700 pl-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-foreground">
                {config.label}
              </span>
              <span className="font-mono text-[11px] font-medium text-default-700">
                Bs {item.amount.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] text-default-500 truncate max-w-36" title={item.accountName}>
              {item.accountName || "Sin asignar"}
            </span>
          </div>
        );
      })}

      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-primary hover:underline text-left font-medium cursor-pointer"
        >
          {isExpanded ? "Ver menos" : `+${breakdown.length - 2} métodos más`}
        </button>
      )}

      <div className="border-t border-dashed border-default-200 dark:border-default-700 pt-0.5 flex justify-between items-center text-[10px] font-semibold text-default-600">
        <span>Total:</span>
        <span className="font-mono text-[11px] font-bold text-default-800">
          Bs {transaction.amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export const CashFlowTable = ({ transactions }: Props) => {
  const [printTransactionId, setPrintTransactionId] = useState<{ id: string; kind: string } | null>(
    null,
  );
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [voidTarget, setVoidTarget] = useState<{ id: string; kind: string; receipt?: string } | null>(
    null,
  );
  const [isVoiding, setIsVoiding] = useState(false);

  const groupedTransactions = transactions;
  const handleVoid = async () => {
    if (!voidTarget) return;
    setIsVoiding(true);
    try {
      const res = await deleteTransaction(voidTarget.id, voidTarget.kind);
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        setVoidTarget(null);
      }
    } catch (error) {
      toast.error("Ocurrió un error al anular la operación");
    } finally {
      setIsVoiding(false);
    }
  };

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
                  Fecha Recibo
                </SortableColumnHeader>
              </Table.Column>
              <Table.Column allowsSorting id="createdAt">
                <SortableColumnHeader id="createdAt">
                  Registro
                </SortableColumnHeader>
              </Table.Column>
              <Table.Column id="receipt">
                <div className="font-semibold">Comprobante</div>
              </Table.Column>
              <Table.Column id="concept">
                <div className="font-semibold">Concepto</div>
              </Table.Column>
              <Table.Column allowsSorting id="amount">
                <div className="text-right">
                  <SortableColumnHeader id="amount" className="justify-end">
                    Monto
                  </SortableColumnHeader>
                </div>
              </Table.Column>
              <Table.Column id="pagador">
                <div className="font-semibold">Pagador</div>
              </Table.Column>
              <Table.Column id="beneficiario">
                <div className="font-semibold">Beneficiario</div>
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
              <Table.Column>
                <div className="text-right">Balance</div>
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
              {groupedTransactions.map((transaction) => {
                const isCancelled = transaction.status === "CANCELLED";
                return (
                  <Table.Row
                    key={transaction.id}
                    id={transaction.id}
                    className={`${isCancelled ? "opacity-60 bg-danger-50/20" : ""} ${transaction.reversesId ? "bg-warning-50/20" : ""}`}
                  >
                    <Table.Cell>
                      <span
                        className="whitespace-nowrap text-default-600"
                        suppressHydrationWarning
                      >
                        {new Date(transaction.transactionDate).toLocaleDateString(
                          "es-BO",
                          { timeZone: "UTC" }
                        )}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="text-sm text-default-700" suppressHydrationWarning>
                          {new Date(transaction.createdAt).toLocaleDateString("es-BO")}
                        </span>
                        <span className="text-xs text-default-400" suppressHydrationWarning>
                          {new Date(transaction.createdAt).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`font-mono text-sm whitespace-nowrap ${isCancelled ? "text-danger" : "text-default-700"}`}
                      >
                        {transaction.receiptSeries && transaction.receiptNumber
                          ? `${transaction.receiptSeries}-${transaction.receiptNumber}`
                          : transaction.receiptNumber
                            ? `${transaction.receiptNumber}`
                            : "—"}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`font-medium max-w-62.5 truncate block ${isCancelled ? "text-danger" : ""}`}
                        title={transaction.concept}
                      >
                        {transaction.concept}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div
                        className={`text-right font-medium ${isCancelled ? "text-danger line-through" : ""}`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"} Bs{" "}
                        {transaction.amount.toFixed(2)}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="text-sm text-default-700 max-w-37.5 truncate">
                          {transaction.payerName || <span className="text-default-400">—</span>}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="text-sm text-default-700 max-w-37.5 truncate">
                          {transaction.beneficiaryName || <span className="text-default-400">—</span>}
                        </span>
                      </div>
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
                          transaction.type === "INCOME" ? "success" : transaction.type === "EXPENSE" ? "danger" : "default"
                        }
                      >
                        {transaction.type === "INCOME" ? "Ingreso" : transaction.type === "EXPENSE" ? "Egreso" : "Transferencia"}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col gap-1 items-start">
                        {(isCancelled || transaction.reversesId) && (
                          <div className="flex flex-wrap gap-1 items-center">
                            {isCancelled && (
                              <Chip
                                size="sm"
                                variant="soft"
                                className="bg-danger-soft text-danger font-bold text-[10px] h-4.5"
                              >
                                Anulado
                              </Chip>
                            )}
                            {transaction.reversesId && (
                              <Chip
                                size="sm"
                                color="warning"
                                variant="soft"
                                className="font-bold text-[10px] h-4.5"
                              >
                                Reverso
                              </Chip>
                            )}
                          </div>
                        )}
                        <PaymentMethodCell transaction={transaction} />
                      </div>
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
                      {transaction.kind === "INTERNAL_TRANSFER" ? (
                        <div className="flex flex-col gap-1 text-sm text-default-700">
                          <span className="truncate max-w-32" title={transaction.sourceAccountName || "Origen"}>
                            {transaction.sourceAccountName || "Origen"}
                          </span>
                          <span className="text-default-400">↓</span>
                          <span className="truncate max-w-32" title={transaction.destAccountName || "Destino"}>
                            {transaction.destAccountName || "Destino"}
                          </span>
                        </div>
                      ) : transaction.kind === "PAYMENT" ? (
                        <div className="flex flex-col gap-1">
                          {transaction.paymentBreakdown && transaction.paymentBreakdown.length > 0 ? (
                            Array.from(new Set(transaction.paymentBreakdown.map((b) => b.accountName))).map((accName, idx) => (
                              <span key={idx} className="text-default-700 text-xs truncate max-w-36" title={accName}>
                                {accName}
                              </span>
                            ))
                          ) : transaction.groupedDetails && transaction.groupedDetails.length > 0 ? (
                            Array.from(new Set(transaction.groupedDetails.map((d) => d.account))).map((accName, idx) => (
                              <span key={idx} className="text-default-700 text-xs truncate max-w-36" title={accName}>
                                {accName}
                              </span>
                            ))
                          ) : (
                            <span className="text-default-700 text-sm truncate max-w-36" title={transaction.accountName || ""}>
                              {transaction.accountName || <span className="text-default-400 italic">Sin asignar</span>}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-default-700 text-sm truncate max-w-36" title={transaction.accountName || ""}>
                          {transaction.accountName ? (
                            transaction.accountName
                          ) : (
                            <span className="text-default-400 italic">Sin asignar</span>
                          )}
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {transaction.kind === "INTERNAL_TRANSFER" ? (
                        <div className="flex flex-col items-end text-right gap-2">
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-default-500">
                              {transaction.sourceBalanceBefore != null ? Number(transaction.sourceBalanceBefore).toFixed(2) : "-"}
                            </span>
                            <span className="font-mono text-xs font-medium text-danger">
                              {transaction.sourceBalanceAfter != null ? Number(transaction.sourceBalanceAfter).toFixed(2) : "-"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-default-500">
                              {transaction.destBalanceBefore != null ? Number(transaction.destBalanceBefore).toFixed(2) : "-"}
                            </span>
                            <span className="font-mono text-xs font-medium text-success">
                              {transaction.destBalanceAfter != null ? Number(transaction.destBalanceAfter).toFixed(2) : "-"}
                            </span>
                          </div>
                        </div>
                      ) : transaction.kind === "PAYMENT" ? (
                        <div className="flex flex-col items-end text-right gap-1.5">
                          {transaction.paymentBreakdown && transaction.paymentBreakdown.length > 0 ? (
                            transaction.paymentBreakdown.map((item, idx) => (
                              <div key={idx} className="flex flex-col items-end text-right">
                                {transaction.paymentBreakdown!.length > 1 && (
                                  <span className="text-[10px] text-default-400 truncate max-w-28 text-right font-medium" title={item.accountName}>
                                    {item.accountName}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 font-mono text-[10px]">
                                  <span className="text-default-500">
                                    {item.balanceBefore != null ? Number(item.balanceBefore).toFixed(2) : "-"}
                                  </span>
                                  <span className="text-default-400">→</span>
                                  <span className="font-medium text-foreground">
                                    {item.balanceAfter != null ? Number(item.balanceAfter).toFixed(2) : "-"}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : transaction.groupedDetails && transaction.groupedDetails.length > 0 ? (
                            transaction.groupedDetails.map((detail, idx) => (
                              <div key={idx} className="flex flex-col items-end text-right">
                                {transaction.groupedDetails!.length > 1 && (
                                  <span className="text-[10px] text-default-400 truncate max-w-28 text-right font-medium" title={detail.account}>
                                    {detail.account}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 font-mono text-[10px]">
                                  <span className="text-default-500">
                                    {detail.balanceBefore != null ? Number(detail.balanceBefore).toFixed(2) : "-"}
                                  </span>
                                  <span className="text-default-400">→</span>
                                  <span className="font-medium text-foreground">
                                    {detail.balanceAfter != null ? Number(detail.balanceAfter).toFixed(2) : "-"}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-end text-right">
                              <span className="font-mono text-xs text-default-500">
                                Anterior:{" "}
                                {transaction.balanceBefore != null
                                  ? `${Number(transaction.balanceBefore).toFixed(2)} Bs`
                                  : "-"}
                              </span>
                              <span className="font-mono text-xs font-medium text-foreground">
                                Nuevo:{" "}
                                {transaction.balanceAfter != null
                                  ? `${Number(transaction.balanceAfter).toFixed(2)} Bs`
                                  : "-"}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-end text-right">
                          <span className="font-mono text-xs text-default-500">
                            Anterior:{" "}
                            {transaction.balanceBefore != null
                              ? `${Number(transaction.balanceBefore).toFixed(2)} Bs`
                              : "-"}
                          </span>
                          <span className="font-mono text-xs font-medium text-foreground">
                            Nuevo:{" "}
                            {transaction.balanceAfter != null
                              ? `${Number(transaction.balanceAfter).toFixed(2)} Bs`
                              : "-"}
                          </span>
                        </div>
                      )}
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
                                  const printId = transaction.kind === "PAYMENT"
                                    ? (transaction.paymentId || transaction.id)
                                    : (transaction.transactionId || transaction.id);
                                  setPrintTransactionId({ id: printId, kind: transaction.kind || "TRANSACTION" });
                                  setShowPrintDialog(true);
                                } else if (key === "void") {
                                  const targetId = transaction.kind === "PAYMENT"
                                    ? (transaction.paymentId || transaction.id)
                                    : transaction.kind === "INTERNAL_TRANSFER"
                                      ? (transaction.internalTransferId || transaction.id)
                                      : (transaction.transactionId || transaction.id);
                                  const receiptLabel = transaction.receiptSeries && transaction.receiptNumber
                                    ? `${transaction.receiptSeries}-${transaction.receiptNumber}`
                                    : transaction.receiptNumber ? String(transaction.receiptNumber) : undefined;
                                  setVoidTarget({ id: targetId, kind: transaction.kind || "TRANSACTION", receipt: receiptLabel });
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
                              {transaction.status !== "CANCELLED" && (
                                <Dropdown.Item
                                  id="void"
                                  textValue={
                                    transaction.kind === "PAYMENT"
                                      ? "Anular Pago"
                                      : transaction.kind === "INTERNAL_TRANSFER"
                                        ? "Anular Transferencia"
                                        : "Anular Transacción"
                                  }
                                  className="text-danger"
                                >
                                  <HugeiconsIcon
                                    icon={Cancel01Icon}
                                    className="text-danger"
                                  />
                                  <Label className="text-danger">
                                    {transaction.kind === "PAYMENT"
                                      ? "Anular Pago"
                                      : transaction.kind === "INTERNAL_TRANSFER"
                                        ? "Anular Transferencia"
                                        : "Anular Transacción"}
                                  </Label>
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <PrintReportDialog
        transactionId={printTransactionId?.id || null}
        reportType={printTransactionId?.kind === "PAYMENT" ? "payment" : "transaction"}
        isOpen={showPrintDialog}
        onOpenChange={setShowPrintDialog}
      />

      <AlertDialog.Backdrop
        isOpen={!!voidTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isVoiding) setVoidTarget(null);
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-md">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Anular {voidTarget?.kind === "PAYMENT" ? "Pago" : voidTarget?.kind === "INTERNAL_TRANSFER" ? "Transferencia Interna" : "Transacción"}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                ¿Estás seguro que deseas anular esta operación? Esta acción
                reversará el movimiento en las cuentas financieras asociadas y
                devolverá el registro a su estado anulado.
              </p>
              {voidTarget?.receipt && (
                <p className="mt-1 text-xs font-mono text-default-600">
                  Comprobante: {voidTarget.receipt}
                </p>
              )}
              <p className="mt-2 text-sm text-default-500">
                Esta acción no se puede deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                onPress={() => setVoidTarget(null)}
                isDisabled={isVoiding}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={handleVoid}
                isPending={isVoiding}
              >
                Sí, Anular
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
};
